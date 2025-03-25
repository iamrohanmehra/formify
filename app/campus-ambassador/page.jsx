"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { submitForm } from "@/app/actions";
import { ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import FormInactive from "../components/FormInactive";

export default function CampusAmbassadorForm() {
  const _router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    college: "",
    yearOfStudy: "",
    motivation: "",
    strategy: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    loading: false,
    error: null,
  });
  const [formActive, setFormActive] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check if the form is active
  useEffect(() => {
    const checkFormStatus = async () => {
      try {
        setCheckingStatus(true);
        const response = await fetch(
          "/api/form-status?form_type=campus-ambassador"
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setFormActive(data.is_active);
        } else {
          // If there's an error, assume the form is active
          console.error("Error checking form status:", data.error);
          setFormActive(true);
        }
      } catch (error) {
        console.error("Error checking form status:", error);
        setFormActive(true);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkFormStatus();
  }, []);

  // Define all form questions
  const baseQuestions = [
    {
      id: "fullName",
      title: "Your Full Name",
      component: (
        <div className="space-y-4 w-full">
          <Input
            id="fullName"
            placeholder="Your answer goes here"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className={cn(
              "border-0 border-b-2 rounded-none px-0 py-0 pb-[8px] text-[24px] text-[#5c5c5c] leading-[32px] w-full focus-visible:ring-0 focus-visible:border-[#37404A] transition-colors placeholder:text-[#37404A80]",
              "!pl-0 !pr-0 !m-0",
              errors.fullName ? "border-red-500" : "border-gray-300"
            )}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            autoFocus
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
      ),
    },
    {
      id: "email",
      title: "Your Email Address",
      component: (
        <div className="space-y-4 w-full">
          <Input
            id="email"
            type="email"
            placeholder="Your answer goes here..."
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={cn(
              "border-0 border-b-2 rounded-none px-0 py-0 pb-[8px] text-[24px] leading-[32px] w-full focus-visible:ring-0 focus-visible:border-[#37404A] transition-colors placeholder:text-[#37404A80]",
              "!pl-0 !pr-0 !m-0",
              errors.email ? "border-red-500" : "border-gray-300"
            )}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            autoFocus
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
      ),
    },
    {
      id: "whatsapp",
      title: "Your WhatsApp Number",
      component: (
        <div className="space-y-4 w-full">
          <Input
            id="whatsapp"
            type="tel"
            placeholder="Your answer goes here..."
            value={formData.whatsapp}
            onChange={(e) => {
              // Only allow numbers
              const value = e.target.value.replace(/[^0-9]/g, "");
              handleChange("whatsapp", value);
            }}
            className={cn(
              "border-0 border-b-2 rounded-none px-0 py-0 pb-[8px] text-[24px] leading-[32px] w-full focus-visible:ring-0 focus-visible:border-[#37404A] transition-colors placeholder:text-[#37404A80]",
              "!pl-0 !pr-0 !m-0",
              errors.whatsapp ? "border-red-500" : "border-gray-300"
            )}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            autoFocus
          />
          {errors.whatsapp && (
            <p className="text-sm text-red-500">{errors.whatsapp}</p>
          )}
        </div>
      ),
    },
    {
      id: "college",
      title: "Your College/Institute Name",
      component: (
        <div className="space-y-4 w-full">
          <Input
            id="college"
            placeholder="Your answer goes here..."
            value={formData.college}
            onChange={(e) => handleChange("college", e.target.value)}
            className={cn(
              "border-0 border-b-2 rounded-none px-0 py-0 pb-[8px] text-[24px] leading-[32px] w-full focus-visible:ring-0 focus-visible:border-[#37404A] transition-colors placeholder:text-[#37404A80]",
              "!pl-0 !pr-0 !m-0",
              errors.college ? "border-red-500" : "border-gray-300"
            )}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            autoFocus
          />
          {errors.college && (
            <p className="text-sm text-red-500">{errors.college}</p>
          )}
        </div>
      ),
    },
    {
      id: "yearOfStudy",
      title: "Your Year of Study",
      component: (
        <div className="space-y-4 w-full">
          <RadioGroup
            value={formData.yearOfStudy}
            onValueChange={(value) => handleChange("yearOfStudy", value)}
            className={cn("space-y-3")}
          >
            <div
              className={cn(
                "flex items-center p-3 border-2 rounded-lg transition-colors",
                formData.yearOfStudy === "1"
                  ? "border-[#37404A] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <RadioGroupItem value="1" id="year-1" className="mr-3" />
              <Label htmlFor="year-1" className="w-full cursor-pointer">
                1st Year
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center p-3 border-2 rounded-lg transition-colors",
                formData.yearOfStudy === "2"
                  ? "border-[#37404A] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <RadioGroupItem value="2" id="year-2" className="mr-3" />
              <Label htmlFor="year-2" className="w-full cursor-pointer">
                2nd Year
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center p-3 border-2 rounded-lg transition-colors",
                formData.yearOfStudy === "3"
                  ? "border-[#37404A] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <RadioGroupItem value="3" id="year-3" className="mr-3" />
              <Label htmlFor="year-3" className="w-full cursor-pointer">
                3rd Year
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center p-3 border-2 rounded-lg transition-colors",
                formData.yearOfStudy === "4"
                  ? "border-[#37404A] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <RadioGroupItem value="4" id="year-4" className="mr-3" />
              <Label htmlFor="year-4" className="w-full cursor-pointer">
                4th Year
              </Label>
            </div>
            <div
              className={cn(
                "flex items-center p-3 border-2 rounded-lg transition-colors",
                formData.yearOfStudy === "other"
                  ? "border-[#37404A] bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
            >
              <RadioGroupItem value="other" id="year-other" className="mr-3" />
              <Label htmlFor="year-other" className="w-full cursor-pointer">
                Other
              </Label>
            </div>
          </RadioGroup>
          {errors.yearOfStudy && (
            <p className="text-sm text-red-500">{errors.yearOfStudy}</p>
          )}
        </div>
      ),
    },
    {
      id: "motivation",
      title: "Your Motivation to Become a Campus Ambassador",
      description: "Please describe in 2-3 sentences (max 300 characters)",
      component: (
        <div className="space-y-4 w-full">
          <textarea
            id="motivation"
            placeholder="Your answer goes here..."
            value={formData.motivation}
            onChange={(e) => handleChange("motivation", e.target.value)}
            maxLength={300}
            className={cn(
              "border-0 border-b-2 rounded-none px-0 py-0 pb-[8px] text-[20px] leading-[32px] w-full focus-visible:ring-0 focus-visible:border-[#37404A] transition-colors placeholder:text-[#37404A80] resize-none min-h-[100px]",
              "!pl-0 !pr-0 !m-0",
              errors.motivation ? "border-red-500" : "border-gray-300"
            )}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            autoFocus
          />
          <div className="text-xs text-gray-500 flex justify-end">
            {formData.motivation?.length || 0}/300 characters
          </div>
          {errors.motivation && (
            <p className="text-sm text-red-500">{errors.motivation}</p>
          )}
        </div>
      ),
    },
    {
      id: "strategy",
      title: "Your Strategy to Promote Codekaro",
      description:
        "Brief description of your promotion strategy (max 500 characters)",
      component: (
        <div className="space-y-4 w-full">
          <textarea
            id="strategy"
            placeholder="Your answer goes here..."
            value={formData.strategy}
            onChange={(e) => handleChange("strategy", e.target.value)}
            maxLength={500}
            className={cn(
              "border-0 border-b-2 rounded-none px-0 py-0 pb-[8px] text-[20px] leading-[32px] w-full focus-visible:ring-0 focus-visible:border-[#37404A] transition-colors placeholder:text-[#37404A80] resize-none min-h-[150px]",
              "!pl-0 !pr-0 !m-0",
              errors.strategy ? "border-red-500" : "border-gray-300"
            )}
            style={{
              paddingLeft: 0,
              paddingRight: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            autoFocus
          />
          <div className="text-xs text-gray-500 flex justify-end">
            {formData.strategy?.length || 0}/500 characters
          </div>
          {errors.strategy && (
            <p className="text-sm text-red-500">{errors.strategy}</p>
          )}
        </div>
      ),
    },
  ];

  const getQuestions = () => {
    return baseQuestions;
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  const validateStep = () => {
    const currentQuestion = questions[step];
    const field = currentQuestion.id;

    if (!formData[field] || formData[field].trim() === "") {
      setErrors({
        ...errors,
        [field]: "This field is required",
      });
      return false;
    }

    // Email validation
    if (field === "email" && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrors({
        ...errors,
        email: "Please enter a valid email address",
      });
      return false;
    }

    // Phone validation
    if (
      field === "whatsapp" &&
      !/^\+?[0-9\s]{10,15}$/.test(formData.whatsapp)
    ) {
      setErrors({
        ...errors,
        whatsapp: "Please enter a valid phone number",
      });
      return false;
    }

    // Text area validation for length
    if (
      (field === "motivation" && formData.motivation.length > 300) ||
      (field === "strategy" && formData.strategy.length > 500)
    ) {
      setErrors({
        ...errors,
        [field]: `Maximum character limit exceeded`,
      });
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        // Form submission logic
        setSubmissionStatus({ loading: true, error: null });

        try {
          console.log(
            "Submitting form data:",
            JSON.stringify(formData, null, 2)
          );

          // Add timestamp for debugging
          console.time("Form submission");

          // Use the server action to submit the form
          const result = await submitForm({
            ...formData,
            form_type: "campus-ambassador",
          });

          console.timeEnd("Form submission");
          console.log(
            "Form submission result:",
            JSON.stringify(result, null, 2)
          );

          if (!result.success) {
            // Check if the form is inactive
            if (result.formInactive) {
              setFormActive(false);
              throw new Error(
                "This form is currently not accepting submissions."
              );
            }
            throw new Error(result.error || "Unknown error occurred");
          }

          setIsSubmitted(true);
        } catch (error) {
          console.error("Error submitting form:", error);
          setSubmissionStatus({
            loading: false,
            error: `Failed to submit form: ${error.message}`,
          });
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const validateCurrentStep = () => {
    const currentQuestion = questions[step];
    const field = currentQuestion.id;

    // Basic validation for empty fields
    if (!formData[field] || formData[field].trim() === "") {
      return false;
    }

    // Email validation
    if (field === "email" && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return false;
    }

    // Phone validation
    if (
      field === "whatsapp" &&
      !/^\+?[0-9\s]{10,15}$/.test(formData.whatsapp)
    ) {
      return false;
    }

    // Text area validation
    if (
      (field === "motivation" && formData.motivation.length > 300) ||
      (field === "strategy" && formData.strategy.length > 500)
    ) {
      return false;
    }

    return true;
  };

  // If the form is inactive, show the inactive message
  if (!formActive && !checkingStatus) {
    return <FormInactive formTitle="Campus Ambassador Application" />;
  }

  // If checking status, show loading
  if (checkingStatus) {
    return (
      <div className="h-[100dvh] w-full flex flex-col justify-center items-center bg-white font-karla font-normal overflow-hidden">
        <p className="text-[18px] text-[#37404AB3]">Loading...</p>
      </div>
    );
  }

  // If the form is submitted, show the thank you message
  if (isSubmitted) {
    return (
      <div
        className="h-[100dvh] w-full flex flex-col justify-center items-center bg-white font-karla font-normal overflow-hidden"
        style={{ fontFamily: "'Karla', sans-serif" }}
      >
        <div className="w-full max-w-md flex flex-col justify-center px-4">
          <div className="w-full text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2
                className="text-[30px] font-[500] leading-[36px] text-[#37404A] mb-[20px]"
                style={{ margin: "0px 0px 20px" }}
              >
                Thank you for applying!
              </h2>
              <p className="text-[18px] leading-[28px] text-[#37404AB3]">
                We&apos;ve received your Campus Ambassador application and will
                review it shortly.
              </p>

              <div className="mt-8 border-t pt-6">
                <p className="text-[16px] leading-[24px] text-[#37404AB3] mb-4">
                  <strong>Next Step:</strong> Join our Campus Ambassador
                  WhatsApp group to stay updated and connect with other
                  ambassadors.
                </p>
                <a
                  href="https://chat.whatsapp.com/Jwk77FjT1akBkkDfpmnXA6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20c35e] text-white rounded-[6px] py-3 px-5 font-medium transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="0"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  Join WhatsApp Group
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const questions = getQuestions();
  const currentQuestion = questions[step];

  return (
    <div
      className="h-[100dvh] w-full flex flex-col justify-center items-center bg-white font-karla font-normal overflow-hidden mt-[-2.75vh] relative"
      style={{ fontFamily: "'Karla', sans-serif" }}
    >
      <div className="w-full max-w-[628px] flex flex-col justify-center px-4">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 sm:space-y-4"
              onKeyDown={handleKeyPress}
            >
              <div className="space-y-1 sm:space-y-2">
                <p className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#37404A80] font-normal">
                  Question {step + 1} <span className="text-red-500">*</span>
                </p>
                <h2 className="text-[18px] sm:text-[20px] mb-9 md:text-[24px] leading-[24px] sm:leading-[28px] md:leading-[32px] text-[#37404a] font-medium">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.description && (
                  <p className="text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#37404A80] font-normal -mt-6 mb-3">
                    {currentQuestion.description}
                  </p>
                )}
              </div>

              <div className="py-1">{currentQuestion.component}</div>

              <div className="flex justify-start pt-2">
                <Button
                  onClick={handleNext}
                  className="bg-[#37404A] hover:bg-[#37404acc] text-white text-[18px] leading-[28px] py-[6px] px-[20px] rounded-[6px] font-karla font-medium cursor-pointer"
                  disabled={submissionStatus.loading}
                >
                  {submissionStatus.loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <span className="flex items-center">
                      {step === questions.length - 1 ? "Submit" : "Next"}
                      {step !== questions.length - 1 && (
                        <ChevronRight className="ml-4 h-5 w-5" />
                      )}
                    </span>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation buttons at the bottom right */}
      <div className="fixed bottom-6 right-6 flex shadow-md">
        <Button
          onClick={handlePrevious}
          disabled={step === 0}
          className="bg-[#37404A] hover:bg-[#37404acc] text-white rounded-l-[6px] rounded-r-none py-[6px] px-[12px] font-karla font-medium cursor-pointer border-r border-r-[#ffffff33]"
          aria-label="Previous question"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleNext}
          disabled={submissionStatus.loading || !validateCurrentStep()}
          className="bg-[#37404A] hover:bg-[#37404acc] text-white rounded-l-none rounded-r-[6px] py-[6px] px-[12px] font-karla font-medium cursor-pointer"
          aria-label={
            step === questions.length - 1 ? "Submit" : "Next question"
          }
        >
          {submissionStatus.loading ? (
            <span>...</span>
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Error message if submission fails */}
      {submissionStatus.error && (
        <div className="text-red-500 text-center w-full mt-4 mb-2">
          {submissionStatus.error}
        </div>
      )}
    </div>
  );
}
