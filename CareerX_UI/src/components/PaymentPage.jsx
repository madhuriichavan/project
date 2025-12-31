import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { paymentAPI, roadmapAPI } from "../services/api";
import toast from "react-hot-toast";

export const PaymentPage = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(999); // Default amount
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create order
      const response = await paymentAPI.createOrder({ amount });
      setOrderData(response.data);

      // Initialize Razorpay
      const options = {
        key: response.data.keyId,
        amount: response.data.amount,
        currency: "INR",
        name: "CareerX",
        description: "Career Roadmap Generation",
        order_id: response.data.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success("Payment successful! Generating your roadmap...");

            // Generate roadmap
            const roadmapResponse = await roadmapAPI.generateRoadmap(
              verifyResponse.data.paymentId
            );

            toast.success("Roadmap generated successfully! Check your email.");
            navigate("/roadmap", { state: { roadmap: roadmapResponse.data } });
          } catch (error) {
            toast.error("Payment verification failed");
            console.error(error);
          }
        },
        prefill: {
          name: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).name
            : "",
          email: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user")).email
            : "",
        },
        theme: {
          color: "#2F4156",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("Failed to initialize payment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE8] flex items-center justify-center py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#2F4156] mb-6 text-center">
          Complete Payment to Generate Your Roadmap
        </h1>

        <div className="space-y-6">
          <div className="bg-[#C8D9E6] p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#2F4156] mb-4">
              What You'll Get:
            </h2>
            <ul className="space-y-2 text-[#2F4156]">
              <li>✓ Personalized career roadmap for top 3 career options</li>
              <li>✓ Step-by-step guidance from basic to advanced</li>
              <li>✓ Detailed skill requirements and certifications</li>
              <li>✓ Job market outlook and salary information</li>
              <li>✓ Roadmap delivered to your email</li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-[#2F4156]">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-[#2F4156]">
                ₹{amount}
              </span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-[#2F4156] text-white py-3 rounded-lg hover:bg-[#567C8D] transition font-semibold text-lg disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

