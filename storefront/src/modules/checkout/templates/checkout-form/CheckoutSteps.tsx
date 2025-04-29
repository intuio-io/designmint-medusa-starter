"use client"

import { useState } from "react"
import { Heading, Button } from "@medusajs/ui"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"

const steps = ["Address", "Shipping", "Payment", "Review"]

const CheckoutSteps = ({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: any) => {
  const [currentStep, setCurrentStep] = useState(0)

  if (!cart) {
    return null
  }

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  const isStepCompleted = (stepIndex: number) => stepIndex < currentStep
  const canProceed = (stepIndex: number) => stepIndex <= currentStep

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1)
  }

  const previousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  return (
    <>
      {/* Step Navigation */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center relative cursor-pointer ${
              canProceed(index) ? "text-black font-semibold" : "text-gray-400"
            }`}
            onClick={() => canProceed(index) && setCurrentStep(index)}
          >
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                currentStep === index ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {step}
            </span>
            {isStepCompleted(index) && (
              <span className="absolute -right-3 top-1 text-green-500">✔</span>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 0 && <Addresses cart={cart} customer={customer} />}
        {currentStep === 1 && (
          <Shipping
            cart={cart}
            availableShippingMethods={shippingMethods}
            previousStep={previousStep}
            nextStep={nextStep}
          />
        )}
        {currentStep === 2 && (
          <Payment
            cart={cart}
            availablePaymentMethods={paymentMethods}
            previousStep={previousStep}
            nextStep={nextStep}
          />
        )}
        {currentStep === 3 && <Review cart={cart} />}
      </div>

      {/* Navigation Buttons */}
      {currentStep == 0 && (
        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button variant="primary" onClick={nextStep}>
              Continue to Shipping
            </Button>
          ) : null}
        </div>
      )}
    </>
  )
}

export default CheckoutSteps
