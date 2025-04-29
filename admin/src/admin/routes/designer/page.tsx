// src/admin/routes/designer/page.tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Swatch } from "@medusajs/icons"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import DesignTypeTab from "../../components/designer/DesignTypeTab"
import DesignTab from "../../components/designer/DesignTab"
import AdminDesignerTab from "../../components/designer/AdminDesignerTab"

const DesignerPage = () => {
  const [activeTab, setActiveTab] = useState("design-types")

  return (
    <div className="flex flex-col space-y-6 p-4">
      {/* Tab Container */}
      <div className="bg-ui-bg-base rounded-lg p-4 border shadow-sm">
        <div className="flex gap-2">
          {[
            { id: "design-types", label: "Design Types" },
            { id: "designs", label: "Designs" },
            { id: "designer", label: "Designer" },
          ].map((tab) => {

            if(tab.id === 'designer') return null;

            return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "secondary" : "transparent"}
                  size="small"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              )
          })}
        </div>
      </div>

      {/* Content Container */}
      <div>
        {activeTab === "design-types" && <DesignTypeTab />}
        {activeTab === "designs" && <DesignTab setActiveTab={setActiveTab} />}
        {activeTab === "designer" && <AdminDesignerTab setActiveTab={setActiveTab} />}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Designer",
  icon: Swatch,
})

export default DesignerPage