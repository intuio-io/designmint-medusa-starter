// src/admin/components/designer/AdminDesignerTab.tsx
import React, { useState, useRef, useEffect } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Input, toast } from "@medusajs/ui"
import { sdk } from "../../lib/sdk"
import DesignerForm from "./DesignerForm"
import { Hand } from "lucide-react"

// Core types
interface Position {
  x: number;
  y: number;
}

interface FileInfo {
  url: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  file_key: string;
}

interface ImageState {
  fileInfo: FileInfo | null;
  originalWidth: number;
  originalHeight: number;
}

interface ImageSize {
  width: number;
  height: number;
  originalWidth?: number;
  originalHeight?: number;
}

interface CanvasSize {
  width: number;
  height: number;
}

type ElementType = "image" | "boundary" | null;
type BoundaryType = "design" | "cutoff";
type ToolType = BoundaryType | "pan" | null;
type ResizeDirection = "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w";
type InteractionMode = "draw" | "resize" | "drag" | "none";

interface Boundary {
  id: number;
  type: BoundaryType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface InteractionState {
  startPosition: Position;
  mode: InteractionMode;
  direction?: ResizeDirection;
  target?: "image" | "boundary";
  initialBoundary?: Boundary;
  initialPosition?: Position;
  initialSize?: { width: number; height: number };
}

// Constants with improved values for better UX
const CONSTANTS = {
  MINIMUM_SIZES: {
    DESIGN: 20,
    CUTOFF: 20,
  },
  HANDLE_SIZE: 12,
  RESIZE_MARGIN: 15,
  GRID_SIZE: 20,
  SPACING: {
    CANVAS_PADDING: 24,
    SECTION_GAP: 0,
    TOOLBAR_PADDING: 20,
  },
  SELECTION: {
    CLICK_TOLERANCE: 0,
    HANDLE_HOVER_AREA: 20,
  },
  Z_INDEX: {
    BASE: 1,
    SELECTED: 1000,
    HANDLES: 1001,
    DRAWING: 1002,
  },
  CURSORS: {
    MOVE: "grab",
    MOVING: "grabbing",
    RESIZE_N: "n-resize",
    RESIZE_S: "s-resize",
    RESIZE_E: "e-resize",
    RESIZE_W: "w-resize",
    RESIZE_NE: "ne-resize",
    RESIZE_NW: "nw-resize",
    RESIZE_SE: "se-resize",
    RESIZE_SW: "sw-resize",
  },
} as const;

// Utility functions
const getDistance = (p1: Position, p2: Position): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const isPointInRect = (
  point: Position,
  rect: { x: number; y: number; width: number; height: number },
  tolerance: number = 0
): boolean => {
  return (
    point.x >= rect.x - tolerance &&
    point.x <= rect.x + rect.width + tolerance &&
    point.y >= rect.y - tolerance &&
    point.y <= rect.y + rect.height + tolerance
  );
};

const AdminDesignerTab = ({ setActiveTab }: any) => {
  const queryClient = useQueryClient()

  // Save design mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
        return await sdk.client.fetch("/admin/designer/designs", {
            method: "POST",
            body: data
          })
        },
        onSuccess: () => {
          toast.success("Design saved successfully", {
            position: "top-right"
          })
          queryClient.invalidateQueries({ queryKey: ["designs"] })
          queryClient.invalidateQueries({ queryKey: ["available-collections"] })
          queryClient.invalidateQueries({ queryKey: ["available-products"] })
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to save design", {
            position: "top-right"
          })
        }
      })

  // Image upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const { files } = await sdk.admin.upload.create({
        files: [file]
      }) as any
      
      return {
        url: files[0]?.url,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        file_key: files[0]?.key,
      }
    },
    onSuccess: () => {
      setUploadError(null)
    },
    onError: (error: any) => {
      setUploadError(error.message || "Failed to upload image")
    }
  })

  // Core states
  const [name, setName] = useState("")
  const [selectedCollection, setSelectedCollection] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [guideFile, setGuideFile] = useState<any>(null)
  const [designTypeId, setDesignTypeId] = useState(null)

  const [selectedElement, setSelectedElement] = useState<ElementType>(null)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [image, setImage] = useState<ImageState | null>(null)
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 0, height: 0 })
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 1100, height: 600 })

  // Boundary and interaction states
  const [boundaries, setBoundaries] = useState<Boundary[]>([])
  const [selectedBoundary, setSelectedBoundary] = useState<number | null>(null)
  const [selectedTool, setSelectedTool] = useState<ToolType>(null)
  const [interactionState, setInteractionState] = useState<InteractionState | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentBoundary, setCurrentBoundary] = useState<Boundary | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPanning, setIsPanning] = useState(false);
  const [tempPanMode, setTempPanMode] = useState(false);
  const [selectedToolBeforePan, setSelectedToolBeforePan] = useState<ToolType>(null);
  const canvasOffsetRef = useRef({ x: 0, y: 0 });

  // Upload states
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Refs
  const canvasRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Zoom state
  const [zoomLevel, setZoomLevel] = useState(1)

  // Reset all interaction states
  const resetInteractions = () => {
    setInteractionState(null)
    setIsDrawing(false)
    setCurrentBoundary(null)
    setIsDragging(false)
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "default"
    }
  }

  // Improved boundary z-index management
  const updateBoundaryZIndex = (boundaryId: number) => {
    setBoundaries((prev) => {
      const maxZIndex = Math.max(...prev.map((b) => b.zIndex), 0)
      return prev.map((b) => ({
        ...b,
        zIndex: b.id === boundaryId ? maxZIndex + 1 : b.zIndex,
      }))
    })
  }

    // ImageResizeHandles component
  const ImageResizeHandles = () => {
    const directions: ResizeDirection[] = ["nw", "ne", "sw", "se"] // Only corner handles
    
    const getHandlePosition = (dir: ResizeDirection) => {
        const isTop = dir.includes("n")
        const isBottom = dir.includes("s")
        const isLeft = dir.includes("w")
        const isRight = dir.includes("e")
    
        return {
          top: isTop ? "-6px" : isBottom ? "calc(100% - 6px)" : "calc(50% - 6px)",
          left: isLeft
            ? "-6px"
            : isRight
            ? "calc(100% - 6px)"
            : "calc(50% - 6px)",
          }
        }
    
        return directions.map((dir) => (
          <div
            key={dir}
            className="absolute w-4 h-4 bg-white border-2 border-ui-border-interactive rounded-full 
                       hover:bg-ui-bg-interactive-hover transition-transform"
            style={{
              ...getHandlePosition(dir),
              zIndex: CONSTANTS.Z_INDEX.HANDLES,
              cursor: `${dir}-resize`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              setInteractionState({
                mode: "resize",
                startPosition: getMousePosition(e) || { x: 0, y: 0 },
                target: "image",
                direction: dir,
                initialPosition: { x: imagePosition.x, y: imagePosition.y },
                initialSize: { width: imageSize.width, height: imageSize.height },
              })
            }}
          />
        ))
      }

  // Enhanced boundary finding at point
  const findBoundariesAtPoint = (point: Position): Boundary[] => {
    return boundaries
      .filter((b) =>
        isPointInRect(point, b, CONSTANTS.SELECTION.CLICK_TOLERANCE)
      )
      .sort((a, b) => b.zIndex - a.zIndex)
  }

  // When setting the image initially
  useEffect(() => {
    if (image) {
      // Center the image
      const x = (canvasSize.width - imageSize.width) / 2
      const y = (canvasSize.height - imageSize.height) / 2
      setImagePosition({ x, y })
    }
  }, [image])

  // Enhanced keyboard event handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is on input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

    // Special case for Alt/Option key
    if (e.altKey && !tempPanMode) {
      e.preventDefault();
      setTempPanMode(true);
      setSelectedToolBeforePan(selectedTool);
      setSelectedTool("pan");
      return;
    }

      switch (e.key.toLowerCase()) {
        case "d":
          setSelectedTool((prev) => (prev === "design" ? null : "design"))
          break

        case "c":
          setSelectedTool((prev) => (prev === "cutoff" ? null : "cutoff"))
          break
        
        case "p":
          setSelectedTool((prev) => (prev === "pan" ? null : "pan"));
          break;

        case "escape":
          e.preventDefault()
          resetInteractions()
          setSelectedTool(null)
          setSelectedBoundary(null)
          break

        case "delete":
        case "backspace":
          if (selectedBoundary !== null) {
            e.preventDefault()
            setBoundaries((prev) =>
              prev.filter((b) => b.id !== selectedBoundary)
            )
            setSelectedBoundary(null)
          }
          break

        case "tab":
          if (boundaries.length > 0) {
            e.preventDefault()
            if (selectedBoundary === null) {
              // If no boundary is selected, select the first one
              setSelectedBoundary(boundaries[0].id)
              updateBoundaryZIndex(boundaries[0].id)
            } else {
              // Find current boundary position and cycle to next
              const currentIndex = boundaries.findIndex(
                (b) => b.id === selectedBoundary
              )
              const nextIndex = (currentIndex + 1) % boundaries.length
              setSelectedBoundary(boundaries[nextIndex].id)
              updateBoundaryZIndex(boundaries[nextIndex].id)
            }
          }
          break

        case "s":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            handleSaveDesign()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedBoundary, boundaries])

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Alt' && tempPanMode) {
      setTempPanMode(false);
      setSelectedTool(selectedToolBeforePan);
    }
  };

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [tempPanMode, selectedToolBeforePan]);

  // making sure we handle the zoom on canvas and restrict zoom on browser
  useEffect(() => {
    const container = canvasRef.current?.parentElement;
    if (!container) return;
  
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newZoom = Math.min(Math.max(zoomLevel + delta, 0.1), 4); // limit zoom
        setZoomLevel(newZoom);
      }
    };
  
    container.addEventListener("wheel", handleWheel, { passive: false });
  
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoomLevel]);

    // Mouse position handler with improved accuracy
    const getMousePosition = (
        e: React.MouseEvent | MouseEvent
      ): Position | null => {
        if (!canvasRef.current) return null
    
        const rect = canvasRef.current.getBoundingClientRect()
    
        // Account for the canvas position and zoom
        const x = (e.clientX - rect.left) / zoomLevel
        const y = (e.clientY - rect.top) / zoomLevel
    
        return { x, y }
      }
    
      // Get resize handle with improved detection
      const getResizeHandleAtPoint = (
        point: Position,
        element: { x: number; y: number; width: number; height: number }
      ): ResizeDirection | null => {
        const handleSize = CONSTANTS.SELECTION.HANDLE_HOVER_AREA
        const handles: Array<[ResizeDirection, Position]> = [
          ["nw", { x: element.x, y: element.y }],
          ["n", { x: element.x + element.width / 2, y: element.y }],
          ["ne", { x: element.x + element.width, y: element.y }],
          [
            "e",
            { x: element.x + element.width, y: element.y + element.height / 2 },
          ],
          ["se", { x: element.x + element.width, y: element.y + element.height }],
          [
            "s",
            { x: element.x + element.width / 2, y: element.y + element.height },
          ],
          ["sw", { x: element.x, y: element.y + element.height }],
          ["w", { x: element.x, y: element.y + element.height / 2 }],
        ]
    
        for (const [direction, handlePos] of handles) {
          if (getDistance(point, handlePos) <= handleSize) {
            return direction
          }
        }
    
        return null
      }


  // Improved cursor style handling
  const getCursorStyle = (
    point: Position,
    element: { x: number; y: number; width: number; height: number },
    elementType: "image" | "boundary" = "boundary"
  ): string => {
    if (selectedTool) return "crosshair"
    if (!element) return "default"
    if (isDragging) return CONSTANTS.CURSORS.MOVING

    // For images, only show resize cursors at corners
    if (elementType === "image") {
      const resizeHandle = getResizeHandleAtPoint(point, element)
      if (resizeHandle) {
        switch (resizeHandle) {
          case "nw":
          case "se":
            return CONSTANTS.CURSORS.RESIZE_NW
          case "ne":
          case "sw":
            return CONSTANTS.CURSORS.RESIZE_NE
        }
      }
      return isPointInRect(point, element) ? CONSTANTS.CURSORS.MOVE : "default"
    }

    // For boundaries, show all resize handles
    const resizeHandle = getResizeHandleAtPoint(point, element)
    if (resizeHandle) {
      switch (resizeHandle) {
        case "n":
        case "s":
          return CONSTANTS.CURSORS.RESIZE_N
        case "e":
        case "w":
          return CONSTANTS.CURSORS.RESIZE_E
        case "nw":
        case "se":
          return CONSTANTS.CURSORS.RESIZE_NW
        case "ne":
        case "sw":
          return CONSTANTS.CURSORS.RESIZE_NE
      }
    }

    return isPointInRect(point, element) ? CONSTANTS.CURSORS.MOVE : "default"
  }

// Part 3: Mouse Event Handlers and Boundary Manipulation

  // Improved mouse down handler with better selection logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
  
    const mousePos = getMousePosition(e);
    if (!mousePos) return;
  
    // Case 0: Panning the canvas
    if (selectedTool === "pan") {
      setIsPanning(true);
      setInteractionState({
        mode: "drag",
        startPosition: { x: e.clientX, y: e.clientY }, // Use client coordinates directly
        initialPosition: canvasOffsetRef.current,
      });
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
      e.preventDefault();
      return;
    }
  
    setSelectedElement(null);
    setSelectedBoundary(null);
  
    // Case 1: Drawing new boundary with active tool
    if (selectedTool === "design" || selectedTool === "cutoff") {
      const maxZIndex = Math.max(...boundaries.map((b) => b.zIndex), 0);
      setIsDrawing(true);
      setCurrentBoundary({
        id: Date.now(),
        type: selectedTool,
        x: mousePos.x,
        y: mousePos.y,
        width: 0,
        height: 0,
        zIndex: maxZIndex + 1,
      });
      setSelectedBoundary(null);
      setSelectedElement(null);
      return;
    }
  
    // Case 2: Check for resize handle on selected boundary
    if (selectedBoundary !== null) {
      const boundary = boundaries.find((b) => b.id === selectedBoundary);
      if (boundary) {
        const resizeHandle = getResizeHandleAtPoint(mousePos, boundary);
        if (resizeHandle) {
          setInteractionState({
            mode: "resize",
            startPosition: mousePos,
            initialBoundary: boundary,
            direction: resizeHandle,
          });
          e.stopPropagation();
          return;
        }
      }
    }
  
    // Case 3: Boundary selection and drag initiation
    const boundariesAtPoint = findBoundariesAtPoint(mousePos);
  
    if (boundariesAtPoint.length > 0) {
      const topBoundary = boundariesAtPoint[0];
  
      // If clicking already selected boundary, prepare for drag
      if (selectedBoundary === topBoundary.id) {
        setInteractionState({
          mode: "drag",
          target: "boundary",
          startPosition: mousePos,
          initialBoundary: topBoundary,
        });
        setIsDragging(true);
        if (canvasRef.current) {
          canvasRef.current.style.cursor = CONSTANTS.CURSORS.MOVING;
        }
      } else {
        // Select new boundary
        setSelectedBoundary(topBoundary.id);
        updateBoundaryZIndex(topBoundary.id);
      }
    } else {
      setSelectedBoundary(null);
    }
  };

// Enhanced mouse move handler with debounced updates
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return
    const mousePos = getMousePosition(e)
    if (!mousePos) return

    // Case 0: Panning the canvas
    if (isPanning && interactionState?.mode === "drag") {
    const { startPosition, initialPosition } = interactionState;
    if (!startPosition || !initialPosition) return;

    // Calculate a zoom-aware scale factor for panning
    // This makes panning slower when zoomed out and faster when zoomed in
    const panScaleFactor = Math.max(zoomLevel, 1);
      
    // When zoomed out (zoomLevel < 1), reduce movement
    // When zoomed in (zoomLevel > 1), increase movement but cap it
    const adjustedDeltaX = (e.clientX - startPosition.x) * panScaleFactor;
    const adjustedDeltaY = (e.clientY - startPosition.y) * panScaleFactor;
      
    // Calculate new canvas offset
    const newOffset = {
      x: initialPosition.x + adjustedDeltaX,
      y: initialPosition.y + adjustedDeltaY
    };
      
    // Update the state
    canvasOffsetRef.current = newOffset;
      
    // Apply the transform with a small delay to reduce jitter
    requestAnimationFrame(() => {
      const zoomContainer = canvasRef.current?.parentElement;
      if (zoomContainer) {
        zoomContainer.style.transform = 
          `translate(${newOffset.x}px, ${newOffset.y}px) scale(${zoomLevel})`;
      }
    });
      
    return;
  }

    // Case 1: Drawing new boundary
    if (isDrawing && currentBoundary) {
      setCurrentBoundary((prev) => {
        if (!prev) return null
        return {
          ...prev,
          width: mousePos.x - prev.x,
          height: mousePos.y - prev.y,
        }
      })
      return
    }

    // Case 2: Resizing image
    if (
      image && 
      interactionState?.mode === "resize" &&
      interactionState.target === "image"
    ) {
      const { startPosition, direction, initialSize, initialPosition } =
        interactionState
      if (!initialSize || !initialPosition) return

      const deltaX = mousePos.x - startPosition.x
      const deltaY = mousePos.y - startPosition.y
      const aspectRatio = image.originalWidth / image.originalHeight

      // Scale factor to make resize more controlled
      const scaleFactor = 0.5 // Adjust this value to make resize more/less sensitive
      let newWidth = initialSize.width
      let newHeight = initialSize.height
      let newX = initialPosition.x
      let newY = initialPosition.y

      switch (direction) {
        case "se":
          // Scale based on diagonal movement for more natural feel
          const seDelta = (deltaX + deltaY) * scaleFactor
          newWidth = Math.max(100, initialSize.width + seDelta)
          newHeight = newWidth / aspectRatio
          break

        case "sw":
          const swDelta = (-deltaX + deltaY) * scaleFactor
          newWidth = Math.max(100, initialSize.width + swDelta)
          newHeight = newWidth / aspectRatio
          newX = initialPosition.x + (initialSize.width - newWidth)
          break

        case "ne":
          const neDelta = (deltaX - deltaY) * scaleFactor
          newWidth = Math.max(100, initialSize.width + neDelta)
          newHeight = newWidth / aspectRatio
          newY = initialPosition.y + (initialSize.height - newHeight)
          break

        case "nw":
          const nwDelta = (-deltaX - deltaY) * scaleFactor
          newWidth = Math.max(100, initialSize.width + nwDelta)
          newHeight = newWidth / aspectRatio
          newX = initialPosition.x + (initialSize.width - newWidth)
          newY = initialPosition.y + (initialSize.height - newHeight)
          break
      }

      // Enforce canvas bounds
      if (newWidth > canvasSize.width) {
        const scale = canvasSize.width / newWidth
        newWidth = canvasSize.width
        newHeight *= scale
      }

      if (newHeight > canvasSize.height) {
        const scale = canvasSize.height / newHeight
        newHeight = canvasSize.height
        newWidth *= scale
      }

      // Ensure the image stays within bounds
      newX = Math.max(0, Math.min(newX, canvasSize.width - newWidth))
      newY = Math.max(0, Math.min(newY, canvasSize.height - newHeight))

      // Apply new size and position if valid
      if (newWidth >= 100 && newHeight >= 100) {
        setImageSize({ width: newWidth, height: newHeight })
        setImagePosition({ x: newX, y: newY })
      }
    }
    // Case 3: Moving image
    else if (
      interactionState?.mode === "drag" &&
      interactionState.target === "image"
    ) {
      const { initialPosition, startPosition } = interactionState
      if (!initialPosition || !startPosition) return

      // Use the initial position to calculate the exact movement
      const newX = Math.max(
        0,
        Math.min(
          initialPosition.x + (mousePos.x - startPosition.x),
          canvasSize.width - imageSize.width
        )
      )
      const newY = Math.max(
        0,
        Math.min(
          initialPosition.y + (mousePos.y - startPosition.y),
          canvasSize.height - imageSize.height
        )
      )

      setImagePosition({ x: newX, y: newY })
      return
    }
    // Case 4: Resizing boundary
    else if (
      interactionState?.mode === "resize" &&
      interactionState.target === "boundary"
    ) {
      const { initialBoundary, startPosition, direction } = interactionState
      if (!direction || !initialBoundary) return

      const deltaX = mousePos.x - startPosition.x
      const deltaY = mousePos.y - startPosition.y
      const minSize = getMinimumSize(initialBoundary.type)

      setBoundaries((prev) =>
        prev.map((b) => {
          if (b.id !== initialBoundary.id) return b

          let newX = initialBoundary.x
          let newY = initialBoundary.y
          let newWidth = initialBoundary.width
          let newHeight = initialBoundary.height

          switch (direction) {
            // East (right) resize
            case "e":
              newWidth = Math.max(minSize, initialBoundary.width + deltaX)
              break

            // West (left) resize
            case "w":
              const maxLeftMove = initialBoundary.width - minSize
              const leftMove = Math.min(deltaX, maxLeftMove)
              newX = initialBoundary.x + leftMove
              newWidth = initialBoundary.width - leftMove
              break

            // North (top) resize
            case "n":
              const maxTopMove = initialBoundary.height - minSize
              const topMove = Math.min(deltaY, maxTopMove)
              newY = initialBoundary.y + topMove
              newHeight = initialBoundary.height - topMove
              break

            // South (bottom) resize
            case "s":
              newHeight = Math.max(minSize, initialBoundary.height + deltaY)
              break

            // North-East corner resize
            case "ne":
              // Handle East (right)
              newWidth = Math.max(minSize, initialBoundary.width + deltaX)
              // Handle North (top)
              const maxTopMoveNE = initialBoundary.height - minSize
              const topMoveNE = Math.min(deltaY, maxTopMoveNE)
              newY = initialBoundary.y + topMoveNE
              newHeight = initialBoundary.height - topMoveNE
              break

            // North-West corner resize
            case "nw":
              // Handle West (left)
              const maxLeftMoveNW = initialBoundary.width - minSize
              const leftMoveNW = Math.min(deltaX, maxLeftMoveNW)
              newX = initialBoundary.x + leftMoveNW
              newWidth = initialBoundary.width - leftMoveNW
              // Handle North (top)
              const maxTopMoveNW = initialBoundary.height - minSize
              const topMoveNW = Math.min(deltaY, maxTopMoveNW)
              newY = initialBoundary.y + topMoveNW
              newHeight = initialBoundary.height - topMoveNW
              break

            // South-East corner resize
            case "se":
              // Handle East (right)
              newWidth = Math.max(minSize, initialBoundary.width + deltaX)
              // Handle South (bottom)
              newHeight = Math.max(minSize, initialBoundary.height + deltaY)
              break

            // South-West corner resize
            case "sw":
              // Handle West (left)
              const maxLeftMoveSW = initialBoundary.width - minSize
              const leftMoveSW = Math.min(deltaX, maxLeftMoveSW)
              newX = initialBoundary.x + leftMoveSW
              newWidth = initialBoundary.width - leftMoveSW
              // Handle South (bottom)
              newHeight = Math.max(minSize, initialBoundary.height + deltaY)
              break
          }

          // Ensure boundary stays within canvas
          newX = Math.max(0, Math.min(newX, canvasSize.width - newWidth))
          newY = Math.max(0, Math.min(newY, canvasSize.height - newHeight))
          newWidth = Math.min(newWidth, canvasSize.width - newX)
          newHeight = Math.min(newHeight, canvasSize.height - newY)

          return {
            ...b,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
          }
        })
      )
    }
    // Case 5: Moving boundary
    else if (
      interactionState?.mode === "drag" &&
      interactionState.target === "boundary"
    ) {
      const { initialBoundary, startPosition } = interactionState
      if (!initialBoundary) return

      const deltaX = mousePos.x - startPosition.x
      const deltaY = mousePos.y - startPosition.y

      setBoundaries((prev) =>
        prev.map((b) => {
          if (b.id !== initialBoundary.id) return b

          const newX = Math.max(
            0,
            Math.min(
              initialBoundary.x + deltaX,
              canvasSize.width - initialBoundary.width
            )
          )
          const newY = Math.max(
            0,
            Math.min(
              initialBoundary.y + deltaY,
              canvasSize.height - initialBoundary.height
            )
          )

          return {
            ...b,
            x: newX,
            y: newY,
          }
        })
      )
    }

    // Case 6: Update cursor based on hover state
    else {
      if (selectedElement === "boundary" && selectedBoundary !== null) {
        const boundary = boundaries.find((b) => b.id === selectedBoundary)
        if (boundary) {
          const cursor = getCursorStyle(mousePos, boundary)
          canvasRef.current.style.cursor = cursor
        }
      } else if (selectedElement === "image") {
        // Update cursor for image interactions
        const imageRect = {
          x: imagePosition.x,
          y: imagePosition.y,
          width: imageSize.width,
          height: imageSize.height,
        }

        const cursor = getCursorStyle(mousePos, imageRect, "image")
        canvasRef.current.style.cursor = cursor
      }
    }
  }

  const handleMouseUp = () => {
    // Handle panning end
    if (isPanning) {
      setIsPanning(false);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = selectedTool === "pan" ? "grab" : "default";
      }
    }

    // Case 1: Finalizing new boundary creation
    if (isDrawing && currentBoundary) {
      const { x, y, width, height, type } = currentBoundary
      const minSize = getMinimumSize(type)

      if (Math.abs(width) >= minSize && Math.abs(height) >= minSize) {
        const normalizedBoundary: Boundary = {
          id: currentBoundary.id,
          type: currentBoundary.type,
          x: width < 0 ? x + width : x,
          y: height < 0 ? y + height : y,
          width: Math.abs(width),
          height: Math.abs(height),
          zIndex: currentBoundary.zIndex,
        }

        setBoundaries((prev) => [...prev, normalizedBoundary])
        setSelectedBoundary(normalizedBoundary.id)
        setSelectedTool(null)
      }
    }

    // Reset all interaction states
    resetInteractions()
  }

// Helper function to get minimum size for boundary type
 const getMinimumSize = (type: BoundaryType): number => {
    return type === "design"
        ? CONSTANTS.MINIMUM_SIZES.DESIGN
        : CONSTANTS.MINIMUM_SIZES.CUTOFF
    }

// Part 4: Size Controls and UI Components

  // Enhanced input component with better control
  const NumberInput = ({
    value,
    onChange,
    min,
    max,
    label,
    unit = "px",
    className = "",
  }: {
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    label: string
    unit?: string
    className?: string
  }) => {
    const [localValue, setLocalValue] = useState(value.toString())
    const inputRef = useRef<HTMLInputElement>(null)

    // Update local value when prop changes
    useEffect(() => {
      setLocalValue(Math.round(value).toString())
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)
    }

    const handleBlur = () => {
      const parsed = parseInt(localValue, 10)
      if (isNaN(parsed)) {
        setLocalValue(value.toString())
      } else {
        const clamped = Math.min(Math.max(parsed, min), max)
        setLocalValue(clamped.toString())
        onChange(clamped)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        inputRef.current?.blur()
      }
    }

    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <label className="text-sm text-ui-fg-subtle min-w-14">{label}:</label>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-24 pr-8 text-right"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ui-fg-subtle">
            {unit}
          </span>
        </div>
      </div>
    )
  }

// Handle canvas resize
const handleCanvasResize = (newSize: CanvasSize) => {
    // Store old size for ratio calculations
    const oldSize = { ...canvasSize }

    // Enforce minimum and maximum sizes
    const validatedSize = {
      width: Math.min(Math.max(newSize.width, 100), 2000),
      height: Math.min(Math.max(newSize.height, 100), 2000),
    }

    setCanvasSize(validatedSize)

    if (image) {
      // Recalculate image size for new canvas dimensions
      const aspectRatio = image.originalWidth / image.originalHeight
      let newWidth = validatedSize.width
      let newHeight = newWidth / aspectRatio

      if (newHeight > validatedSize.height) {
        newHeight = validatedSize.height
        newWidth = validatedSize.height * aspectRatio
      }

      setImageSize((prev) => ({
        ...prev,
        width: newWidth,
        height: newHeight,
      }))

      // Calculate scaling ratios
      const widthRatio = validatedSize.width / oldSize.width
      const heightRatio = validatedSize.height / oldSize.height

      // Scale existing boundaries
      setBoundaries((prev) =>
        prev.map((boundary) => {
          // Scale positions and dimensions
          const scaledBoundary = {
            ...boundary,
            x: boundary.x * widthRatio,
            y: boundary.y * heightRatio,
            width: boundary.width * widthRatio,
            height: boundary.height * heightRatio,
          }

          // Ensure boundary stays within canvas bounds
          return {
            ...scaledBoundary,
            x: Math.max(
              0,
              Math.min(
                scaledBoundary.x,
                validatedSize.width - scaledBoundary.width
              )
            ),
            y: Math.max(
              0,
              Math.min(
                scaledBoundary.y,
                validatedSize.height - scaledBoundary.height
              )
            ),
          }
        })
      )

      // Scale current boundary if one is being drawn
      if (currentBoundary) {
        setCurrentBoundary((prev) => {
          if (!prev) return null
          return {
            ...prev,
            x: prev.x * widthRatio,
            y: prev.y * heightRatio,
            width: prev.width * widthRatio,
            height: prev.height * heightRatio,
          }
        })
      }
    }
  }

  // Improved size controls component
  const SizeControls = ({
    width,
    height,
    onWidthChange,
    onHeightChange,
    showFitButton = false,
  }: {
    width: number
    height: number
    onWidthChange: (width: number) => void
    onHeightChange: (height: number) => void
    showFitButton?: boolean
  }) => {
    return (
      <div className="space-y-3 pr-2">
        <div className="flex flex-wrap items-center gap-8">
          <NumberInput
            label="Width"
            value={width}
            onChange={onWidthChange}
            min={100}
            max={2000}
          />
          <NumberInput
            label="Height"
            value={height}
            onChange={onHeightChange}
            min={100}
            max={2000}
          />
          {showFitButton && image && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                if (!image) return

                const aspectRatio = image.originalWidth / image.originalHeight
                let newWidth = canvasSize.width
                let newHeight = newWidth / aspectRatio

                // If height exceeds canvas, scale based on height instead
                if (newHeight > canvasSize.height) {
                  newHeight = canvasSize.height
                  newWidth = newHeight * aspectRatio
                }

                // Update size
                setImageSize({
                  width: newWidth,
                  height: newHeight,
                })

                // Center the image
                setImagePosition({
                  x: (canvasSize.width - newWidth) / 2,
                  y: (canvasSize.height - newHeight) / 2,
                })
              }}
            >
              Fit to Canvas
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Improved canvas size handling
  const handleCanvasWidthChange = (newWidth: number) => {
    handleCanvasResize({
      ...canvasSize,
      width: newWidth,
    })
  }

  const handleCanvasHeightChange = (newHeight: number) => {
    handleCanvasResize({
      ...canvasSize,
      height: newHeight,
    })
  }

  // Part 5: Image Handling and Toolbar Components

  // Enhanced file validation
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
      }
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: "Image file size must be less than 10MB",
      }
    }

    return { valid: true }
  }

  // Enhanced image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation: any = validateFile(file)
    if (!validation.valid) {
      setUploadError(validation.error)
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Clear existing state
      setBoundaries([])
      setSelectedBoundary(null)
      setSelectedTool(null)
      setCurrentBoundary(null)

      // Upload the image file
      const fileInfo = await uploadMutation.mutateAsync(file)

      // Load image and get dimensions
      const img = new Image()
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const aspectRatio = img.width / img.height
            let newWidth = canvasSize.width
            let newHeight = newWidth / aspectRatio

            if (newHeight > canvasSize.height) {
              newHeight = canvasSize.height
              newWidth = canvasSize.height * aspectRatio
            }

            setImageSize({
              width: newWidth,
              height: newHeight,
              originalWidth: img.width,
              originalHeight: img.height,
            })

            setImage({
              fileInfo,
              originalWidth: img.width,
              originalHeight: img.height,
            })

            resolve()
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = fileInfo.url
      })

      setIsUploading(false)
      setUploadError(null)

      // Reset file input
      if (e.target) {
        e.target.value = ""
      }
    } catch (error) {
      console.error("Image upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
      setImage(null)
      setImageSize({ width: 0, height: 0 })
      setBoundaries([])
    } finally {
      setIsUploading(false)
    }
  }

  // Enhanced metadata export with validations
  const validateBoundaries = (): { valid: boolean; message?: string } => {
    if (boundaries.length === 0) {
      return {
        valid: false,
        message:
          "Please add at least one design area or cutoff line before exporting.",
      }
    }

    // Calculate true image bounds accounting for zoom and transformations
    const scaledImageLeft = imagePosition.x
    const scaledImageTop = imagePosition.y
    const scaledImageRight = scaledImageLeft + imageSize.width
    const scaledImageBottom = scaledImageTop + imageSize.height

    // Check boundaries outside image with scaled coordinates
    const outsideBoundaries = boundaries.filter((b) => {
      // Get boundary edges
      const boundaryRight = b.x + b.width
      const boundaryBottom = b.y + b.height

      // Check if boundary is completely outside the image area
      const isOutside =
        boundaryRight < scaledImageLeft ||
        b.x > scaledImageRight ||
        boundaryBottom < scaledImageTop ||
        b.y > scaledImageBottom

      return isOutside
    })

    if (outsideBoundaries.length > 0) {
      return {
        valid: false,
        message:
          "Some boundaries are outside the image area. Please adjust them before exporting.",
      }
    }
    return { valid: true }
  }
  
  // Canvas image creation for preview export
  const createCanvasImage = async (): Promise<FileInfo | null> => {
    // Create a temporary canvas
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx || !image?.fileInfo) return null

    // Set canvas size to match original image dimensions for high quality
    canvas.width = image.originalWidth
    canvas.height = image.originalHeight

    // Load the background image
    const img = new Image()
    img.src = image.fileInfo.url
    
    // Wait for the image to load
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Failed to load image"))
    })

    // Draw the background image at original dimensions
    ctx.drawImage(img, 0, 0, image.originalWidth, image.originalHeight)

    // Calculate scale factors to convert boundary positions to original image scale
    const scaleX = image.originalWidth / imageSize.width
    const scaleY = image.originalHeight / imageSize.height

    // Draw boundaries
    boundaries.forEach((boundary) => {
      ctx.beginPath()
      ctx.strokeStyle = boundary.type === "design" ? "#22c55e" : "#eab308"
      ctx.fillStyle =
        boundary.type === "design" ? "rgba(34, 197, 94, 0.2)" : "transparent"
      ctx.lineWidth = 2 * scaleX // Scale line width

      if (boundary.type === "cutoff") {
        ctx.setLineDash([5 * scaleX, 5 * scaleX]) // Scale dash pattern
      } else {
        ctx.setLineDash([])
      }

      // Convert coordinates relative to image and scale to original dimensions
      const imageLeft = (canvasSize.width - imageSize.width) / 2
      const imageTop = (canvasSize.height - imageSize.height) / 2
      
      const x = (boundary.x - imageLeft) * scaleX
      const y = (boundary.y - imageTop) * scaleY
      const width = boundary.width * scaleX
      const height = boundary.height * scaleY

      ctx.rect(x, y, width, height)
      ctx.stroke()
      ctx.fill()
    })

    // Convert canvas to Blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob!)
        },
        "image/png",
        1.0
      ) // Use maximum quality
    })

    // Create File object from Blob
    const fileName = `design-preview-${image.fileInfo.name}`
    const file = new File([blob], fileName, { type: "image/png" })

    try {
      // Upload using the SDK
      const { files } = await sdk.admin.upload.create({
        files: [file]
      }) as any
      
      return {
        url: files[0]?.url,
        name: fileName,
        type: "image/png",
        size: blob.size,
        uploadedAt: new Date().toISOString(),
        file_key: files[0]?.key,
      }
    } catch (error) {
      console.error("Failed to upload canvas image:", error)
      return null
    }
  }

    // Handle save design
    const handleSaveDesign = async () => {
        if (!name.trim()) {
          toast.error("Please enter a name", {
            position: "top-right"
          })
          return
        }
        
        // Validate that either collection or product is selected
        if (!selectedCollection && !selectedProduct) {
          toast.error("Please select either a collection or a product", {
            position: "top-right"
          })
          return
        }
        
        if (!guideFile) {
          toast.error("Please upload a guide image", {
            position: "top-right"
          })
          return
        }
    
        if (!image?.fileInfo) {
          toast.error("Please upload an image first", {
            position: "top-right"
          })
          return
        }
    
        if (!designTypeId) {
          toast.error("Please select a design type", {
            position: "top-right"
          })
          return
        }
    
        const validation = validateBoundaries()
        if (!validation.valid) {
          toast.error(validation.message || "Invalid boundaries", {
            position: "top-right"
          })
          return
        }
    
        const previewImage = await createCanvasImage()
    
        const imageLeft = (canvasSize.width - imageSize.width) / 2
        const imageTop = (canvasSize.height - imageSize.height) / 2
    
        const metadata = {
          canvasSize,
          image: {
            url: image.fileInfo.url,
            file_key: image.fileInfo.file_key,
            name: image.fileInfo.name,
            type: image.fileInfo.type,
            size: image.fileInfo.size,
            uploadedAt: image.fileInfo.uploadedAt,
            originalSize: {
              width: image.originalWidth,
              height: image.originalHeight,
            },
            updatedSize: imageSize,
          },
          previewImage: previewImage?.url || null,
          designAreas: boundaries
            .filter((b) => b.type === "design")
            .map((area) => ({
              id: area.id,
              x: ((area.x - imageLeft) / imageSize.width) * 100,
              y: ((area.y - imageTop) / imageSize.height) * 100,
              width: (area.width / imageSize.width) * 100,
              height: (area.height / imageSize.height) * 100,
            })),
          cutoffLines: boundaries
            .filter((b) => b.type === "cutoff")
            .map((line) => ({
              id: line.id,
              x: ((line.x - imageLeft) / imageSize.width) * 100,
              y: ((line.y - imageTop) / imageSize.height) * 100,
              width: (line.width / imageSize.width) * 100,
              height: (line.height / imageSize.height) * 100,
            })),
        }
    
        try {
          const designData = {
            name: name,
            design_type_id: designTypeId,
            guide_url: guideFile.url,
            img_url: image.fileInfo.url,
            meta_data: metadata,
             // Include either collection_id or product_id based on selection
            ...(selectedCollection ? { collection_id: selectedCollection.value } : {}),
            ...(selectedProduct ? { product_id: selectedProduct.value } : {})
          }
    
          await saveMutation.mutateAsync(designData)
    
          // Download metadata as a JSON file
          const blob = new Blob([JSON.stringify(metadata, null, 2)], {
            type: "application/json",
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `design-metadata-${
            image.fileInfo.name.split(".")[0]
          }.json`
          link.click()
          URL.revokeObjectURL(url)
          setActiveTab('designs')
        } catch (error) {
          console.error("Save error:", error)
          toast.error(
            error instanceof Error ? error.message : "Failed to save design",
            { position: "top-right" }
          )
        }
      }

// Toolbar component
const Toolbar = () => {
    return (
        <div className="flex flex-wrap items-center gap-8 bg-ui-bg-base border rounded-lg shadow-sm p-5 mb-6">
            <SizeControls
              width={canvasSize.width}
              height={canvasSize.height}
              onWidthChange={handleCanvasWidthChange}
              onHeightChange={handleCanvasHeightChange}
              showFitButton={true}
            />
          <div className="flex items-center gap-4 px-6 border-l border-r">
            <button
              onClick={() =>
                setSelectedTool(selectedTool === "design" ? null : "design")
              }
              className={`
                p-3 rounded flex items-center gap-2 transition-colors
                ${
                  selectedTool === "design"
                    ? "bg-ui-bg-interactive-muted text-ui-fg-interactive"
                    : "hover:bg-ui-bg-subtle"
                }
              `}
              disabled={!image || isUploading}
              title="Add Design Area (D)"
            >
              <div className="w-5 h-5 border-2 border-current" />
            </button>
    
            <button
              onClick={() =>
                setSelectedTool(selectedTool === "cutoff" ? null : "cutoff")
              }
              className={`
                p-3 rounded flex items-center gap-2 transition-colors
                ${
                  selectedTool === "cutoff"
                    ? "bg-ui-bg-interactive-muted text-ui-fg-interactive"
                    : "hover:bg-ui-bg-subtle"
                }
              `}
              disabled={!image || isUploading}
              title="Add Cutoff Line (C)"
            >
              <div className="w-5 h-5 border-2 border-dashed border-current" />
            </button>

          <button
            onClick={() => setSelectedTool(selectedTool === "pan" ? null : "pan")}
            className={`
              p-3 rounded flex items-center transition-colors
              ${
                selectedTool === "pan"
                  ? "bg-ui-bg-interactive-muted text-ui-fg-interactive"
                  : "hover:bg-ui-bg-subtle"
              }
            `}
            disabled={isUploading}
            title="Pan Canvas (P)"
          >
            <Hand size={24}/>
          </button>
          </div>
    
          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.1))}
              className="p-2 hover:bg-ui-bg-subtle rounded"
              title="Zoom Out"
            >
              -
            </button>
            <span className="min-w-[4rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 4))}
              className="p-2 hover:bg-ui-bg-subtle rounded"
              title="Zoom In"
            >
              +
            </button>
            <Button
              variant="secondary"
              size="small"
              className="ml-4"
              onClick={() => {
                setZoomLevel(1);
                canvasOffsetRef.current = { x: 0, y: 0 };
                const zoomContainer = canvasRef.current?.parentElement;
                if (zoomContainer) {
                  zoomContainer.style.transform = `translate(0px, 0px) scale(1)`;
                }
              }}
            >
              Reset View
            </Button>
          </div>
    
          {image && (
            <Button
              variant="primary"
              size="base"
              className="ml-auto flex items-center gap-2"
              onClick={handleSaveDesign}
              title="Save (Ctrl/Cmd + S)"
            >
              Save <span className="text-sm opacity-75">(Ctrl/⌘ + S)</span>
            </Button>
          )}
        </div>
      )
}

  // Part 6: Main Render Method and Final Implementation

  // Legend component
  const Legend = () => {
    if (!image) return null

    return (
      <div className="flex gap-6 px-4 py-3 bg-ui-bg-base border rounded-lg text-sm text-ui-fg-subtle">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-green-500 bg-green-500 bg-opacity-20" />
          <span>Design Area</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-dashed border-yellow-500" />
          <span>Cut Line</span>
        </div>
      </div>
    )
  }

  // Keyboard shortcuts info component
  const KeyboardShortcuts = () => (
    <div className="flex flex-wrap gap-4 text-sm text-ui-fg-subtle bg-ui-bg-subtle p-4 rounded-lg">
      <span className="font-medium">Keyboard Shortcuts:</span>
      <span>
        <span className="font-bold">D</span> - Design Area
      </span>
      <span>
        <span className="font-bold">C</span> - Cutoff Line
      </span>
      <span>
        <span className="font-bold">P</span> - Pan Tool
      </span>
      <span>
        <span className="font-bold">Ctrl/⌘ + S</span> - Export
      </span>
      <span>
        <span className="font-bold">Delete</span> - Remove Selected
      </span>
      <span>
        <span className="font-bold">Tab</span> - Cycle Selection
      </span>
      <span>
        <span className="font-bold">Esc</span> - Clear Selection
      </span>
    </div>
  )

  // Tool instructions component
  const ToolInstructions = () => {
    if (!selectedTool) return null

    return (
      <div className="text-sm text-ui-fg-subtle bg-ui-bg-subtle p-4 rounded-lg">
        {selectedTool === "design" && "Click and drag to create a design area where users can place their designs"}
        {selectedTool === 'cutoff' && "Click and drag to indicate where the product will be cut" }
        {selectedTool === 'pan' && "Click and drag to move around the canvas"}
      </div>
    )
  }

  // Resize handles component for boundaries
  const ResizeHandles = ({ boundary }: { boundary: Boundary }) => {
    const directions: ResizeDirection[] = [
      "n",
      "s",
      "e",
      "w",
      "nw",
      "ne",
      "sw",
      "se",
    ]

    const getHandlePosition = (dir: ResizeDirection) => {
      const isTop = dir.includes("n")
      const isBottom = dir.includes("s")
      const isLeft = dir.includes("w")
      const isRight = dir.includes("e")

      return {
        top: isTop ? "-6px" : isBottom ? "calc(100% - 6px)" : "calc(50% - 6px)",
        left: isLeft
          ? "-6px"
          : isRight
          ? "calc(100% - 6px)"
          : "calc(50% - 6px)",
        cursor: getCursorStyle(
          {
            x:
              boundary.x +
              (isLeft ? 0 : isRight ? boundary.width : boundary.width / 2),
            y:
              boundary.y +
              (isTop ? 0 : isBottom ? boundary.height : boundary.height / 2),
          },
          boundary
        ),
      }
    }

    return directions.map((dir) => (
      <div
        key={dir}
        className="absolute w-4 h-4 bg-white border-2 border-ui-border-interactive rounded-full 
                   hover:bg-ui-bg-interactive-hover transition-transform"
        style={{
          ...getHandlePosition(dir),
          zIndex: CONSTANTS.Z_INDEX.HANDLES,
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          setInteractionState({
            mode: "resize",
            target: "boundary",
            startPosition: getMousePosition(e) || { x: 0, y: 0 },
            initialBoundary: boundary,
            direction: dir,
          })
        }}
      />
    ))
  }


  // Render the designer UI
  return (
    <div className="w-full select-none space-y-6">

      {/* Form */}
      <DesignerForm
        name={name}
        setName={setName}
        selectedCollection={selectedCollection}
        setSelectedCollection={setSelectedCollection}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        guideFile={guideFile}
        setGuideFile={setGuideFile}
        designTypeId={designTypeId}
        setDesignTypeId={setDesignTypeId}
        mainImage={image}
        handleMainImageUpload={handleImageUpload}
        isMainImageUploading={isUploading}
        mainImageUploadError={uploadError}
      />

      {/* Toolbar */}
      <Toolbar />

      {/* Main workspace */}
      <div className="bg-ui-bg-base border rounded-lg shadow-sm overflow-hidden">
        {/* Controls section */}
        <div className="p-6 border-b space-y-6">
          <KeyboardShortcuts />
          <ToolInstructions />
        </div>

        {/* Canvas container */}
        <div
          className="relative bg-ui-bg-subtle border-t overflow-hidden"
          style={{
            height: `${
              canvasSize.height + CONSTANTS.SPACING.CANVAS_PADDING * 2
            }px`,
            padding: CONSTANTS.SPACING.CANVAS_PADDING,
          }}
        >
          {/* Zoom */}
          <div
           className="relative w-full h-full"
           style={{
             transform: `translate(${canvasOffsetRef.current.x}px, ${canvasOffsetRef.current.y}px) scale(${zoomLevel})`,
             transformOrigin: "center",
             transition: isPanning ? "none" : "transform 0.1s ease",
           }}
          >
            {/* Main canvas */}
            <div
              ref={canvasRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     bg-ui-bg-base shadow-md"
              style={{
                width: canvasSize.width,
                height: canvasSize.height,
                cursor: selectedTool ? "crosshair" : "default",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Grid background */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(200, 200, 200, 0.3) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(200, 200, 200, 0.3) 1px, transparent 1px)
                `,
                  backgroundSize: `${CONSTANTS.GRID_SIZE}px ${CONSTANTS.GRID_SIZE}px`,
                }}
              />

              {/* Image */}
              {image && image.fileInfo && (
                <div
                  className="absolute"
                  style={{
                    left: `${imagePosition.x}px`,
                    top: `${imagePosition.y}px`,
                    width: `${imageSize.width}px`,
                    height: `${imageSize.height}px`,
                    pointerEvents: selectedTool ? "none" : "auto",
                  }}
                  onMouseDown={(e) => {
                    if (selectedTool) return
                    e.stopPropagation()
                    setSelectedElement("image")
                    setSelectedBoundary(null)
                    setInteractionState({
                      mode: "drag",
                      target: "image",
                      startPosition: getMousePosition(e) || { x: 0, y: 0 },
                      initialPosition: {
                        x: imagePosition.x,
                        y: imagePosition.y,
                      },
                    })
                  }}
                >
                  {/* Selection outline that doesn't affect layout */}
                  {selectedElement === "image" && (
                    <div
                      className="absolute inset-[-2px] border-2 border-blue-500 pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                  <img
                    ref={imageRef}
                    src={image.fileInfo.url}
                    alt="Design template"
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                  {selectedElement === "image" && <ImageResizeHandles />}
                </div>
              )}

              {/* Boundaries */}
              {boundaries.map((boundary) => (
                <div
                  key={boundary.id}
                  className={`absolute transition-colors ${
                    boundary.type === "design"
                      ? `border-2 ${
                          boundary.id === selectedBoundary
                            ? "border-blue-500 bg-blue-500 bg-opacity-20"
                            : "border-green-500 bg-green-500 bg-opacity-20"
                        }`
                      : `border-2 border-dashed ${
                          boundary.id === selectedBoundary
                            ? "border-blue-500"
                            : "border-yellow-500"
                        }`
                  }`}
                  style={{
                    left: boundary.x,
                    top: boundary.y,
                    width: boundary.width,
                    height: boundary.height,
                    cursor: getCursorStyle(
                      { x: boundary.x, y: boundary.y },
                      boundary
                    ),
                    zIndex: boundary.zIndex,
                  }}
                >
                  {boundary.id === selectedBoundary && (
                    <ResizeHandles boundary={boundary} />
                  )}
                </div>
              ))}

              {/* Drawing preview */}
              {isDrawing && currentBoundary && (
                <div
                  className={`absolute border-2 ${
                    currentBoundary.type === "design"
                      ? "border-green-500 bg-green-500 bg-opacity-20"
                      : "border-yellow-500 border-dashed"
                  }`}
                  style={{
                    left: currentBoundary.x,
                    top: currentBoundary.y,
                    width: currentBoundary.width,
                    height: currentBoundary.height,
                    zIndex: CONSTANTS.Z_INDEX.DRAWING,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend and status info */}
      <div className="flex items-center justify-between">
        <Legend />

        {/* Status Information */}
        {image && (
          <div className="text-sm text-ui-fg-subtle">
            <p>
              Original Size: {image.originalWidth} × {image.originalHeight}
            </p>
            <p>
              Current Size: {Math.round(imageSize.width)} ×{" "}
              {Math.round(imageSize.height)}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDesignerTab