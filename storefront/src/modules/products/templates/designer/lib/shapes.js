import { fabric } from "fabric";
import { Hexagon, Circle, Triangle, Heart, Star, Cloud, Zap } from 'lucide-react';
import { 
    Pentagon, Octagon, Diamond, 
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, 
    ArrowUpRight, ArrowUpLeft, ArrowDownRight, ArrowDownLeft,
    ChevronUp, ChevronDown, ChevronLeft, ChevronRight,
    ChevronsUp, ChevronsDown, ChevronsLeft, ChevronsRight,
    CornerUpLeft, CornerUpRight
  } from 'lucide-react';

  import { 
    Award, Bookmark, Bell, Flag, 
    CheckCircle, XCircle, Trash, Mail, 
    Search, User, Users, 
    Key, Lock, Paperclip, Calendar,
    MessageCircle, Clock, Play, Pause, 
    Download, Upload, Share, Edit,  Facebook, Twitter, Instagram, Linkedin, 
    Youtube, Github, Gitlab, Dribbble, Slack
  } from 'lucide-react';

  import { 
    Chrome, Globe,
    Sun, Moon, Sunrise, Sunset,
    Umbrella, Wind, Thermometer, Droplets,
    TreePine, Leaf, Flower,
    MapPin, Map, Compass, Navigation
  } from 'lucide-react';


const SHAPE_CATEGORIES = {
    BASIC: 'Basic Shapes',
    ARROWS: 'Arrows',
    SYMBOLS: 'Symbols',
    SOCIAL: 'Social Icons',
    NATURE: 'Nature',
    INTERFACE: 'Interface'
  };

  const SHAPE_DEFAULTS = {
    width: 100,
    height: 100,
    radius: 50,  // for circles
    fill: null,
    stroke: '#000000',  
    strokeWidth: 2,
    opacity: 1,
    strokeUniform: true,
    noScaleCache: false,  // This helps with stroke rendering during scaling
    objectCaching: true 
  };

  const getCommonShapeProps = (area) => ({
    id: `shape-${Date.now()}`,
    left: area.left + area.width / 3,
    top: area.top + area.height / 2,
    originX: 'center',
    originY: 'center',
    strokeWidth: SHAPE_DEFAULTS.strokeWidth,
    stroke: SHAPE_DEFAULTS.stroke,
    fill: SHAPE_DEFAULTS.fill,
    opacity: SHAPE_DEFAULTS.opacity,
    strokeUniform: SHAPE_DEFAULTS.strokeUniform,  
    noScaleCache: SHAPE_DEFAULTS.noScaleCache,  // This helps with stroke rendering during scaling
    objectCaching: SHAPE_DEFAULTS.objectCaching   // This improves performance
  });



export const SHAPES = [
    // Basic Shapes Category
  {
    id: 'circle',
    label: 'Circle',
    category: SHAPE_CATEGORIES.BASIC,
    icon: Circle,
    create: (canvas, area, controls) => {
        return new fabric.Circle({
            radius: SHAPE_DEFAULTS.radius,
            fill: SHAPE_DEFAULTS.fill,
            stroke: SHAPE_DEFAULTS.stroke,
            strokeWidth: SHAPE_DEFAULTS.strokeWidth,
            ...getCommonShapeProps(area)
        });
    }
},
{
  id: 'triangle',
  label: 'Triangle',
  category: SHAPE_CATEGORIES.BASIC,
  icon: Triangle,
  create: (canvas, area, controls) => {
      return new fabric.Triangle({
          width: SHAPE_DEFAULTS.width,
          height: SHAPE_DEFAULTS.height,
          fill: SHAPE_DEFAULTS.fill,
          stroke: SHAPE_DEFAULTS.stroke,
          strokeWidth: SHAPE_DEFAULTS.strokeWidth,
          ...getCommonShapeProps(area)
      });
  }
},
{
  id: 'ellipse',
  label: 'Ellipse',
  category: SHAPE_CATEGORIES.BASIC,
  icon: Circle,
  create: (canvas, area, controls) => {
      return new fabric.Ellipse({
          rx: SHAPE_DEFAULTS.width / 2,
          ry: SHAPE_DEFAULTS.height / 3,
          fill: SHAPE_DEFAULTS.fill,
          stroke: SHAPE_DEFAULTS.stroke,
          strokeWidth: SHAPE_DEFAULTS.strokeWidth,
          ...getCommonShapeProps(area)
      });
  }
},
    // Add more shapes from Lucide icons
    {
      id: 'heart',
      label: 'Heart',
      category: SHAPE_CATEGORIES.SYMBOLS,
      icon: Heart,
      create: (canvas, area, controls) => {
          const path = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
          return new fabric.Path(path, {
              fill: SHAPE_DEFAULTS.fill,
              stroke: SHAPE_DEFAULTS.stroke,
              strokeWidth: SHAPE_DEFAULTS.strokeWidth,
              scaleX: 2,
              scaleY: 2,
              ...getCommonShapeProps(area)
          });
      }
  },
  {
    id: 'star',
    label: 'Star',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: Star,
    create: (canvas, area, controls) => {
        const path = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
        return new fabric.Path(path, {
            fill: SHAPE_DEFAULTS.fill,
            stroke: SHAPE_DEFAULTS.stroke,
            strokeWidth: SHAPE_DEFAULTS.strokeWidth,
            scaleX: 2,
            scaleY: 2,
            ...getCommonShapeProps(area)
        });
    }
},
{
  id: 'cloud',
  label: 'Cloud',
  category: SHAPE_CATEGORIES.NATURE,
  icon: Cloud,
  create: (canvas, area, controls) => {
      const path = "M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z";
      return new fabric.Path(path, {
          fill: SHAPE_DEFAULTS.fill,
          stroke: SHAPE_DEFAULTS.stroke,
          strokeWidth: SHAPE_DEFAULTS.strokeWidth,
          scaleX: 2,
          scaleY: 2,
          ...getCommonShapeProps(area)
      });
  }
},
{
  id: 'lightning',
  label: 'Lightning',
  category: SHAPE_CATEGORIES.NATURE,
  icon: Zap,
  create: (canvas, area, controls) => {
      const path = "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z";
      return new fabric.Path(path, {
          fill: SHAPE_DEFAULTS.fill,
          stroke: SHAPE_DEFAULTS.stroke,
          strokeWidth: SHAPE_DEFAULTS.strokeWidth,
          scaleX: 2,
          scaleY: 2,
          ...getCommonShapeProps(area)
      });
  }
},
{
    id: 'hexagon',
    label: 'Hexagon',
    category: SHAPE_CATEGORIES.BASIC,
    icon: Hexagon,
    create: (canvas, area, controls) => {
      const size = SHAPE_DEFAULTS.width / 2;
      const points = [
        { x: size, y: 0 },
        { x: size * 2, y: size * 0.75 },
        { x: size * 2, y: size * 2.25 },
        { x: size, y: size * 3 },
        { x: 0, y: size * 2.25 },
        { x: 0, y: size * 0.75 }
      ];
      return new fabric.Polygon(points, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'pentagon',
    label: 'Pentagon',
    category: SHAPE_CATEGORIES.BASIC,
    icon: Pentagon,
    create: (canvas, area, controls) => {
      const size = SHAPE_DEFAULTS.width / 2;
      const points = [
        { x: size, y: 0 },
        { x: size * 2, y: size },
        { x: size * 1.5, y: size * 2 },
        { x: size * 0.5, y: size * 2 },
        { x: 0, y: size }
      ];
      return new fabric.Polygon(points, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'octagon',
    label: 'Octagon',
    category: SHAPE_CATEGORIES.BASIC,
    icon: Octagon,
    create: (canvas, area, controls) => {
      const size = SHAPE_DEFAULTS.width / 3;
      const points = [
        { x: size, y: 0 },
        { x: size * 2, y: 0 },
        { x: size * 3, y: size },
        { x: size * 3, y: size * 2 },
        { x: size * 2, y: size * 3 },
        { x: size, y: size * 3 },
        { x: 0, y: size * 2 },
        { x: 0, y: size }
      ];
      return new fabric.Polygon(points, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'diamond',
    label: 'Diamond',
    category: SHAPE_CATEGORIES.BASIC,
    icon: Diamond,
    create: (canvas, area, controls) => {
      const size = SHAPE_DEFAULTS.width / 2;
      const points = [
        { x: size, y: 0 },
        { x: size * 2, y: size },
        { x: size, y: size * 2 },
        { x: 0, y: size }
      ];
      return new fabric.Polygon(points, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        ...getCommonShapeProps(area)
      });
    }
  },
  
  // ARROWS CATEGORY
  {
    id: 'arrow-up',
    label: 'Arrow Up',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowUp,
    create: (canvas, area, controls) => {
      const path = "M12 19V5M5 12l7-7 7 7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-down',
    label: 'Arrow Down',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowDown,
    create: (canvas, area, controls) => {
      const path = "M12 5v14M19 12l-7 7-7-7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-left',
    label: 'Arrow Left',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowLeft,
    create: (canvas, area, controls) => {
      const path = "M19 12H5M12 19l-7-7 7-7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-right',
    label: 'Arrow Right',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowRight,
    create: (canvas, area, controls) => {
      const path = "M5 12h14M12 5l7 7-7 7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-up-right',
    label: 'Arrow Up Right',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowUpRight,
    create: (canvas, area, controls) => {
      const path = "M7 17L17 7M7 7h10v10";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-up-left',
    label: 'Arrow Up Left',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowUpLeft,
    create: (canvas, area, controls) => {
      const path = "M17 17L7 7M17 7H7v10";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-down-right',
    label: 'Arrow Down Right',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowDownRight,
    create: (canvas, area, controls) => {
      const path = "M7 7l10 10M7 17h10V7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'arrow-down-left',
    label: 'Arrow Down Left',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ArrowDownLeft,
    create: (canvas, area, controls) => {
      const path = "M17 7L7 17M17 17H7V7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevron-up',
    label: 'Chevron Up',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronUp,
    create: (canvas, area, controls) => {
      const path = "M18 15l-6-6-6 6";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevron-down',
    label: 'Chevron Down',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronDown,
    create: (canvas, area, controls) => {
      const path = "M6 9l6 6 6-6";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevron-left',
    label: 'Chevron Left',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronLeft,
    create: (canvas, area, controls) => {
      const path = "M15 18l-6-6 6-6";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevron-right',
    label: 'Chevron Right',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronRight,
    create: (canvas, area, controls) => {
      const path = "M9 18l6-6-6-6";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevrons-up',
    label: 'Chevrons Up',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronsUp,
    create: (canvas, area, controls) => {
      const path = "M17 11l-5-5-5 5M17 18l-5-5-5 5";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevrons-down',
    label: 'Chevrons Down',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronsDown,
    create: (canvas, area, controls) => {
      const path = "M7 13l5 5 5-5M7 6l5 5 5-5";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevrons-left',
    label: 'Chevrons Left',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronsLeft,
    create: (canvas, area, controls) => {
      const path = "M11 17l-5-5 5-5M18 17l-5-5 5-5";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chevrons-right',
    label: 'Chevrons Right',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: ChevronsRight,
    create: (canvas, area, controls) => {
      const path = "M13 17l5-5-5-5M6 17l5-5-5-5";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'corner-up-left',
    label: 'Corner Up Left',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: CornerUpLeft,
    create: (canvas, area, controls) => {
      const path = "M9 14L4 9l5-5M20 20v-7a4 4 0 00-4-4H4";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'corner-up-right',
    label: 'Corner Up Right',
    category: SHAPE_CATEGORIES.ARROWS,
    icon: CornerUpRight,
    create: (canvas, area, controls) => {
      const path = "M15 14l5-5-5-5M4 20v-7a4 4 0 014-4h12";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 4,
        scaleY: 4,
        ...getCommonShapeProps(area)
      });
    }
  },
  // SYMBOLS CATEGORY
  {
    id: 'award',
    label: 'Award',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: Award,
    create: (canvas, area, controls) => {
      const path = "M8.21 13.89L7 23l5-3 5 3-1.21-9.12M11 2.5a6 6 0 1 1 2 11.66A6 6 0 0 1 11 2.5z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'bookmark',
    label: 'Bookmark',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: Bookmark,
    create: (canvas, area, controls) => {
      const path = "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'bell',
    label: 'Bell',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: Bell,
    create: (canvas, area, controls) => {
      const path = "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'flag',
    label: 'Flag',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: Flag,
    create: (canvas, area, controls) => {
      const path = "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12M4 22V15";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'check-circle',
    label: 'Check Circle',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: CheckCircle,
    create: (canvas, area, controls) => {
      const path = "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'x-circle',
    label: 'X Circle',
    category: SHAPE_CATEGORIES.SYMBOLS,
    icon: XCircle,
    create: (canvas, area, controls) => {
      const path = "M12 2a10 10 0 1010 10A10 10 0 0012 2M15 9l-6 6M9 9l6 6";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },  
  // INTERFACE CATEGORY
  {
    id: 'trash',
    label: 'Trash',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Trash,
    create: (canvas, area, controls) => {
      const path = "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'mail',
    label: 'Mail',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Mail,
    create: (canvas, area, controls) => {
      const path = "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'search',
    label: 'Search',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Search,
    create: (canvas, area, controls) => {
      const path = "M11 17.25a6.25 6.25 0 110-12.5 6.25 6.25 0 010 12.5zM16 16l4.5 4.5";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'user',
    label: 'User',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: User,
    create: (canvas, area, controls) => {
      const path = "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 7a4 4 0 100-8 4 4 0 000 8z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'users',
    label: 'Users',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Users,
    create: (canvas, area, controls) => {
      const path = "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 7a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'key',
    label: 'Key',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Key,
    create: (canvas, area, controls) => {
      const path = "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'lock',
    label: 'Lock',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Lock,
    create: (canvas, area, controls) => {
      const path = "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'paperclip',
    label: 'Paperclip',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Paperclip,
    create: (canvas, area, controls) => {
      const path = "M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'calendar',
    label: 'Calendar',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Calendar,
    create: (canvas, area, controls) => {
      const path = "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z M16 2v4 M8 2v4 M3 10h18";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'message-circle',
    label: 'Message Circle',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: MessageCircle,
    create: (canvas, area, controls) => {
      const path = "M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'clock',
    label: 'Clock',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Clock,
    create: (canvas, area, controls) => {
      const path = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'play',
    label: 'Play',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Play,
    create: (canvas, area, controls) => {
      const path = "M5 3l14 9-14 9V3z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'pause',
    label: 'Pause',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Pause,
    create: (canvas, area, controls) => {
      const path = "M6 4h4v16H6V4z M14 4h4v16h-4V4z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'download',
    label: 'Download',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Download,
    create: (canvas, area, controls) => {
      const path = "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'upload',
    label: 'Upload',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Upload,
    create: (canvas, area, controls) => {
      const path = "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'share',
    label: 'Share',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Share,
    create: (canvas, area, controls) => {
      const path = "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'edit',
    label: 'Edit',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Edit,
    create: (canvas, area, controls) => {
      const path = "M20 14.66V20a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h5.34 M18 2l4 4-10 10H8v-4l10-10z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  
  // SOCIAL ICONS CATEGORY
  {
    id: 'facebook',
    label: 'Facebook',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Facebook,
    create: (canvas, area, controls) => {
      const path = "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'twitter',
    label: 'Twitter',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Twitter,
    create: (canvas, area, controls) => {
      const path = "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'instagram',
    label: 'Instagram',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Instagram,
    create: (canvas, area, controls) => {
      const path = "M16 4H8C5.791 4 4 5.791 4 8v8c0 2.209 1.791 4 4 4h8c2.209 0 4-1.791 4-4V8c0-2.209-1.791-4-4-4z M12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6z M16.5 7.5h.01";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Linkedin,
    create: (canvas, area, controls) => {
      const path = "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'github',
    label: 'GitHub',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Github,
    create: (canvas, area, controls) => {
      const path = "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'gitlab',
    label: 'GitLab',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Gitlab,
    create: (canvas, area, controls) => {
      const path = "M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Dribbble,
    create: (canvas, area, controls) => {
      const path = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'slack',
    label: 'Slack',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Slack,
    create: (canvas, area, controls) => {
      const path = "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'youtube',
    label: 'YouTube',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Youtube,
    create: (canvas, area, controls) => {
      const path = "M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'chrome',
    label: 'Chrome',
    category: SHAPE_CATEGORIES.SOCIAL,
    icon: Chrome,
    create: (canvas, area, controls) => {
      const path = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8a4 4 0 100 8 4 4 0 000-8z M21.17 8H12 M3.95 6.06L8.54 14 M10.88 21.94L15.46 14";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'globe',
    label: 'Globe',
    category: SHAPE_CATEGORIES.INTERFACE,
    icon: Globe,
    create: (canvas, area, controls) => {
      const path = "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  
  // NATURE CATEGORY
  {
    id: 'sun',
    label: 'Sun',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Sun,
    create: (canvas, area, controls) => {
      const path = "M12 17a5 5 0 100-10 5 5 0 000 10z M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'moon',
    label: 'Moon',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Moon,
    create: (canvas, area, controls) => {
      const path = "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'sunrise',
    label: 'Sunrise',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Sunrise,
    create: (canvas, area, controls) => {
      const path = "M17 18a5 5 0 00-10 0 M12 2v7 M4.93 10.93l1.41 1.41 M19.07 10.93l-1.41 1.41 M22 18H2 M8 6l4-4 4 4";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'sunset',
    label: 'Sunset',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Sunset,
    create: (canvas, area, controls) => {
      const path = "M17 18a5 5 0 00-10 0 M12 9V2 M4.93 10.93l1.41 1.41 M19.07 10.93l-1.41 1.41 M22 18H2 M16 6l-4 4-4-4";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'umbrella',
    label: 'Umbrella',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Umbrella,
    create: (canvas, area, controls) => {
      const path = "M23 12a11.05 11.05 0 00-22 0zm-5 7a3 3 0 01-6 0v-7";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'wind',
    label: 'Wind',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Wind,
    create: (canvas, area, controls) => {
      const path = "M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'thermometer',
    label: 'Thermometer',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Thermometer,
    create: (canvas, area, controls) => {
      const path = "M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  },
  {
    id: 'droplets',
    label: 'Droplets',
    category: SHAPE_CATEGORIES.NATURE,
    icon: Droplets,
    create: (canvas, area, controls) => {
      const path = "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z M12.56 6.6A10.97 10.97 0 0014 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 01-11.91 4.97";
      return new fabric.Path(path, {
        fill: SHAPE_DEFAULTS.fill,
        stroke: SHAPE_DEFAULTS.stroke,
        strokeWidth: SHAPE_DEFAULTS.strokeWidth,
        scaleX: 2,
        scaleY: 2,
        ...getCommonShapeProps(area)
      });
    }
  }
];