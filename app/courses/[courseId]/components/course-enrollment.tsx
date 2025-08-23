"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Clock, Award, Download, Globe, CheckCircle, AlertCircle, Gift, Lock } from "lucide-react"

interface CourseEnrollmentProps {
  course: {
    id: string
    title: string
    price: number
    originalPrice: number
    cmeCredits: number
    duration: string
    certificate: boolean
    downloadable: boolean
    lifetime: boolean
  }
}

export function CourseEnrollment({ course }: CourseEnrollmentProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const discount = course.originalPrice - course.price
  const discountPercent = Math.round((discount / course.originalPrice) * 100)

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true)
    }
  }

  const handleEnrollment = async () => {
    if (!agreeTerms) return

    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Redirect to course or show success
    }, 2000)
  }

  const finalPrice = promoApplied ? course.price - 30 : course.price

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Enroll in Course</CardTitle>
        <CardDescription>Get instant access to all course materials</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Course Summary */}
        <div className="space-y-3">
          <h3 className="font-medium line-clamp-2">{course.title}</h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{course.duration} of content</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>{course.cmeCredits} CME Credits</span>
            </div>
            {course.certificate && (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span>Certificate of completion</span>
              </div>
            )}
            {course.downloadable && (
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground" />
                <span>Downloadable resources</span>
              </div>
            )}
            {course.lifetime && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>Lifetime access</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Course Price</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${course.price}</span>
              {course.originalPrice > course.price && (
                <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
              )}
            </div>
          </div>

          {course.originalPrice > course.price && (
            <div className="flex items-center justify-between text-green-600">
              <span className="text-sm">Discount ({discountPercent}% off)</span>
              <span className="text-sm font-medium">-${discount}</span>
            </div>
          )}

          {/* Promo Code */}
          <div className="space-y-2">
            <Label htmlFor="promo">Promo Code</Label>
            <div className="flex gap-2">
              <Input
                id="promo"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
              />
              <Button variant="outline" onClick={handleApplyPromo} disabled={promoApplied || !promoCode}>
                Apply
              </Button>
            </div>
            {promoApplied && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Gift className="h-4 w-4" />
                <span>Promo code applied! $30 off</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalPrice}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="cursor-pointer">
                PayPal
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Payment Form */}
        {paymentMethod === "card" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
          <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">Secure 256-bit SSL encryption</span>
        </div>

        {/* Enroll Button */}
        <Button className="w-full" size="lg" onClick={handleEnrollment} disabled={!agreeTerms || isProcessing}>
          {isProcessing ? (
            <>
              <Lock className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Enroll Now - ${finalPrice}
            </>
          )}
        </Button>

        {/* Money Back Guarantee */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Shield className="h-4 w-4" />
            <span className="font-medium">30-day money-back guarantee</span>
          </div>
          <p>Full refund if you're not satisfied</p>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Instant access after payment</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Course materials available for download</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>CME certificate issued upon completion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
