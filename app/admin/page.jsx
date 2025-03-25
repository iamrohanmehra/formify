"use client";

import { useState, useEffect, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter, Search } from "lucide-react";

// List of authorized admin emails
const AUTHORIZED_ADMINS = [
  "rohanmehra224466@gmail.com",
  "ashish.efslon@gmail.com",
];

export default function AdminDashboard() {
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [submissionCounts, setSubmissionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [_user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // State for the confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formToToggle, setFormToToggle] = useState(null);

  // State for delete confirmation dialog
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  // New state for pagination and filtering
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    search: "",
  });

  const [sorting, setSorting] = useState({
    field: "created_at",
    order: "desc",
  });

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // New state for the fulltext modal
  const [fullTextModal, setFullTextModal] = useState({
    isOpen: false,
    title: "",
    content: "",
    fieldType: "",
  });

  const [searchLoading, setSearchLoading] = useState(false);

  // Add a separate searchTerm state that we'll use in the dependency array
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const supabase = createClientComponentClient({
    options: {
      cookieOptions: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  });

  // Define formatDate within useCallback to avoid re-creation on every render
  const formatDate = useCallback((date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // YYYY-MM-DD format
  }, []);

  // Define fetchSubmissions with useCallback
  const fetchSubmissions = useCallback(
    async (formType, page = 1, newFilters = null, newSorting = null) => {
      try {
        setLoading(true);
        if (page === 1 && newFilters?.search) {
          setSearchLoading(true);
        }
        setError(null);

        // Use provided filters/sorting or current state
        const currentFilters = newFilters || filters;
        const currentSorting = newSorting || sorting;

        // Build the query string with all parameters
        const params = new URLSearchParams({
          form_type: formType,
          page: page.toString(),
          pageSize: pagination.pageSize.toString(),
          sortField: currentSorting.field,
          sortOrder: currentSorting.order,
          _: new Date().getTime().toString(), // Cache-busting timestamp
        });

        // Add optional filters
        if (currentFilters.startDate) {
          params.append("startDate", formatDate(currentFilters.startDate));
        }
        if (currentFilters.endDate) {
          params.append("endDate", formatDate(currentFilters.endDate));
        }
        if (currentFilters.search) {
          params.append("search", currentFilters.search);
        }

        const response = await fetch(
          `/api/admin/submissions?${params.toString()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch submissions");
        }

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch submissions");
        }

        setSubmissions(data.submissions || []);
        setPagination(data.pagination);
        setLoading(false);
        setSearchLoading(false);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err.message || "Failed to fetch submissions");
        setLoading(false);
        setSearchLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.pageSize, sorting, formatDate, searchTerm]
    // We intentionally exclude 'filters' from the dependency array to prevent
    // unnecessary searches while typing in the search input
  );

  // Now define fetchForms with useCallback
  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);

      console.log("Fetching forms from API...");
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/forms?_=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch forms");
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch forms");
      }

      console.log("Forms data:", data);

      if (data.forms && data.forms.length > 0) {
        setForms(data.forms);

        // Store submission counts if available
        if (data.submissionCounts) {
          setSubmissionCounts(data.submissionCounts);
        }

        setSelectedForm(data.forms[0]);
        // Further fetch submissions for the first form
        fetchSubmissions(data.forms[0].form_type);
      } else {
        console.log("No forms found");
        setForms([]);
      }
    } catch (error) {
      console.error("Error fetching forms:", error);
      setError("Failed to load forms. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [fetchSubmissions]);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/admin/login");
          return;
        }

        if (!AUTHORIZED_ADMINS.includes(session.user.email)) {
          await supabase.auth.signOut();
          router.push("/admin/login");
          return;
        }

        setUser(session.user);
        setAuthChecked(true);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router, supabase]);

  useEffect(() => {
    if (authChecked) {
      fetchForms();
    }
  }, [authChecked, fetchForms]);

  // Show confirmation modal before toggling form status
  const handleToggleClick = (formId, currentStatus) => {
    setFormToToggle({ id: formId, currentStatus });
    setShowConfirmModal(true);
  };

  // Handle confirmation modal response
  const handleConfirmToggle = async (confirmed) => {
    setShowConfirmModal(false);

    if (confirmed && formToToggle) {
      await toggleFormStatus(formToToggle.id, formToToggle.currentStatus);
    }

    setFormToToggle(null);
  };

  // Show delete confirmation modal
  const handleDeleteClick = (submission) => {
    setSubmissionToDelete(submission);
    setShowDeleteConfirmModal(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async (confirmed) => {
    setShowDeleteConfirmModal(false);

    if (confirmed && submissionToDelete) {
      await deleteSubmission(submissionToDelete.id);
    }

    setSubmissionToDelete(null);
  };

  // Delete a submission
  const deleteSubmission = async (submissionId) => {
    try {
      setLoading(true);
      setError(null);

      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/admin/delete-submission?_=${timestamp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify({
            submissionId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to delete submission");
      }

      // Refresh the submissions list
      fetchSubmissions(selectedForm.form_type, pagination.page);

      // Display a success message
      console.log(`Submission deleted successfully`);
    } catch (err) {
      console.error("Error deleting submission:", err);
      setError(err.message || "Failed to delete submission");
    } finally {
      setLoading(false);
    }
  };

  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      // Get the form object from the forms array
      const form = forms.find((f) => f.id === formId);
      if (!form) {
        throw new Error(`Form with ID ${formId} not found`);
      }

      // Toggle the status (opposite of current)
      const newStatus = !currentStatus;

      // Update local state immediately for better UX
      setForms(
        forms.map((f) => (f.id === formId ? { ...f, is_active: newStatus } : f))
      );

      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/admin/toggle-form-status?_=${timestamp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          body: JSON.stringify({
            form_type: form.form_type,
            is_active: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Revert the state if the API call fails
        setForms(
          forms.map((f) =>
            f.id === formId ? { ...f, is_active: currentStatus } : f
          )
        );
        throw new Error(data.error || "Failed to toggle form status");
      }

      console.log(
        `Form ${form.form_type} status toggled to ${
          newStatus ? "active" : "inactive"
        }`
      );
    } catch (err) {
      console.error("Error toggling form status:", err);
      setError(err.message || "Failed to toggle form status");
    }
  };

  const handleFormSelect = (form) => {
    setSelectedForm(form);
    setShowSubmissions(true);
    setFilters({
      startDate: null,
      endDate: null,
      search: "",
    });
    setPagination({
      ...pagination,
      page: 1,
    });
    fetchSubmissions(form.form_type, 1);

    // Scroll to top for better UX
    window.scrollTo(0, 0);
  };

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      page: newPage,
    });
    fetchSubmissions(selectedForm.form_type, newPage);
  };

  const handleSortChange = (field) => {
    const newOrder =
      sorting.field === field && sorting.order === "asc" ? "desc" : "asc";
    const newSorting = {
      field,
      order: newOrder,
    };
    setSorting(newSorting);
    fetchSubmissions(selectedForm.form_type, pagination.page, null, newSorting);
  };

  const handleFilterApply = () => {
    fetchSubmissions(selectedForm.form_type, 1, filters);
    setFilterDialogOpen(false);
  };

  const handleFilterReset = () => {
    const resetFilters = {
      startDate: null,
      endDate: null,
      search: "",
    };
    setFilters(resetFilters);
    fetchSubmissions(selectedForm.form_type, 1, resetFilters);
    setFilterDialogOpen(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    // Only update the state, never trigger search here
    setFilters({
      ...filters,
      search: searchValue,
    });
    // No search is triggered here - only updating the state
  };

  const handleSearchSubmit = () => {
    if (!selectedForm || !filters.search.trim()) return;

    // Update the searchTerm to match filters.search when actually searching
    setSearchTerm(filters.search);

    // Reset pagination to page 1 when searching
    setPagination({
      ...pagination,
      page: 1,
    });

    // Use page 1 and the current filters/sorting from state
    fetchSubmissions(selectedForm.form_type, 1, filters, sorting);
  };

  // Only handle search on Enter key press
  const handleSearchKeyDown = (e) => {
    // Only respond to Enter key presses
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  // Generate table headers based on form type
  const getTableHeaders = (formType) => {
    // Common headers for all forms
    const commonHeaders = [
      { key: "created_at", label: "Date" },
      { key: "email_address", label: "Email" },
    ];

    // Form-specific headers
    let formSpecificHeaders = [];

    if (formType === "formx1" || formType === "formx4") {
      formSpecificHeaders = [
        { key: "full_name", label: "Name" },
        { key: "whatsapp_number", label: "WhatsApp" },
        { key: "preference", label: "Preference" },
        { key: "occupation", label: "Occupation" },
      ];

      if (formType === "formx1") {
        formSpecificHeaders.push({
          key: "form_data.recommendation",
          label: "Recommendation",
        });
      } else if (formType === "formx4") {
        formSpecificHeaders.push(
          { key: "form_data.frontend_interest", label: "Frontend Interest" },
          { key: "form_data.income", label: "Income Range" }
        );
      }
    } else if (formType === "campus-ambassador") {
      formSpecificHeaders = [
        // Use dedicated columns for campus ambassador form
        { key: "full_name", label: "Full Name" },
        { key: "whatsapp_number", label: "WhatsApp" },
        { key: "form_data.college", label: "College" },
        { key: "form_data.year_of_study", label: "Year of Study" },
        { key: "form_data.motivation", label: "Motivation" },
        { key: "form_data.strategy", label: "Strategy" },
      ];
    }

    return [...commonHeaders, ...formSpecificHeaders];
  };

  // Get a value from a submission using a key path (e.g., 'form_data.recommendation')
  const getSubmissionValue = (submission, keyPath) => {
    if (!submission) return null;

    if (!keyPath.includes(".")) {
      // For campus ambassador submissions, handle the special case for full_name
      if (keyPath === "full_name") {
        // Use the dedicated column if available, otherwise fall back to form_data
        const fullName =
          submission.full_name ||
          (submission.form_data && submission.form_data.fullName) ||
          (submission.form_data && submission.form_data.full_name) ||
          "";
        return formatFieldValue(fullName, keyPath);
      }

      // For whatsapp_number, use dedicated column if available
      if (keyPath === "whatsapp_number") {
        const whatsapp =
          submission.whatsapp_number ||
          (submission.form_data && submission.form_data.whatsapp_number) ||
          (submission.form_data && submission.form_data.whatsapp) ||
          "";
        return formatFieldValue(whatsapp, keyPath);
      }

      // For email_address, use email_address column
      if (keyPath === "email_address") {
        const email =
          submission.email_address ||
          (submission.form_data && submission.form_data.email_address) ||
          (submission.form_data && submission.form_data.email) ||
          "";
        return formatFieldValue(email, keyPath);
      }

      return formatFieldValue(submission[keyPath], keyPath);
    }

    const [parent, child] = keyPath.split(".");

    // Handle form_data as an object
    if (parent === "form_data") {
      // If form_data is an object
      if (submission.form_data && typeof submission.form_data === "object") {
        return formatFieldValue(submission.form_data[child], child);
      }

      // If form_data is a string, try to parse it
      if (submission.form_data && typeof submission.form_data === "string") {
        try {
          const formData = JSON.parse(submission.form_data);
          return formatFieldValue(formData[child], child);
        } catch (e) {
          console.error("Error parsing form_data:", e);
        }
      }

      // Check for legacy fields directly on the submission object
      if (submission[child] !== undefined) {
        return formatFieldValue(submission[child], child);
      }

      // For frontend_interest field, check both naming conventions
      if (
        child === "frontend_interest" &&
        submission.frontendInterest !== undefined
      ) {
        return formatFieldValue(submission.frontendInterest, child);
      }

      // For recommendation field, check both naming conventions
      if (
        child === "recommendation" &&
        submission.recommendation !== undefined
      ) {
        return formatFieldValue(submission.recommendation, child);
      }

      // For income field, check both naming conventions
      if (child === "income" && submission.income !== undefined) {
        return formatFieldValue(submission.income, child);
      }
    }

    return null;
  };

  // Format field values appropriately for display
  const formatFieldValue = (value, fieldType) => {
    if (value === null || value === undefined) return "";

    // Format date fields
    if (fieldType === "created_at") {
      try {
        return new Date(value).toLocaleString();
      } catch {
        // Use empty catch block since we don't need the error variable
        return value;
      }
    }

    // Truncate long text fields (like motivation and strategy) and make them clickable
    if (
      ["motivation", "strategy"].includes(fieldType) &&
      typeof value === "string" &&
      value.length > 0
    ) {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 bg-white border-[#37404A]/30 hover:bg-[#37404A]/5 hover:border-[#37404A]/50 text-[#37404A] text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer"
          onClick={() =>
            setFullTextModal({
              isOpen: true,
              title:
                fieldType === "motivation"
                  ? "Motivation to Become a Campus Ambassador"
                  : "Strategy to Promote Codekaro",
              content: value,
              fieldType: fieldType,
            })
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View {fieldType === "motivation" ? "Motivation" : "Strategy"}
        </Button>
      );
    }

    return value;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // Only render the dashboard content if authentication has been checked
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white font-karla flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#37404A]"></div>
          <p className="mt-4 text-[#37404A]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-karla flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-3 px-4 sm:py-4 sm:px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 text-[#37404A] sm:w-5 sm:h-5"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h1 className="text-2xl font-semibold text-[#37404A]">
              Codekaro Forms Admin
            </h1>
          </div>

          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="text-[#37404A] border-[#37404A] text-xs sm:text-sm hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 sm:px-6 sm:py-8">
        {loading && !error && (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#37404A]" />
              <span className="text-[#37404A]">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red-500 mr-2 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p className="text-red-700 text-sm sm:text-base">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-6 sm:space-y-8">
            {/* Dashboard View (Forms) */}
            {!showSubmissions && (
              <>
                {/* Forms Section */}
                <section className="mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-[24px] font-[500] text-[#37404A] mb-3 sm:mb-4">
                    Available Forms
                  </h2>
                  <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-[25%] font-medium text-[#37404A] text-sm sm:text-base">
                            Form Title
                          </TableHead>
                          <TableHead className="w-[20%] font-medium text-[#37404A] text-sm sm:text-base hidden sm:table-cell">
                            Form Type
                          </TableHead>
                          <TableHead className="w-[15%] font-medium text-[#37404A] text-sm sm:text-base">
                            Submissions
                          </TableHead>
                          <TableHead className="w-[20%] font-medium text-[#37404A] text-sm sm:text-base">
                            Status
                          </TableHead>
                          <TableHead className="w-[20%] font-medium text-[#37404A] text-sm sm:text-base">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {forms.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-gray-500 text-sm sm:text-base"
                            >
                              No forms available
                            </TableCell>
                          </TableRow>
                        ) : (
                          forms.map((form) => {
                            const submissionCount =
                              submissionCounts[form.form_type] || 0;

                            return (
                              <TableRow
                                key={form.id}
                                className="hover:bg-gray-50"
                              >
                                <TableCell className="font-medium w-[25%] text-[#37404A] text-sm sm:text-base">
                                  {form.title}
                                </TableCell>
                                <TableCell className="w-[20%] text-gray-600 text-sm sm:text-base hidden sm:table-cell">
                                  {form.form_type}
                                </TableCell>
                                <TableCell className="w-[15%]">
                                  <Badge className="bg-[#37404A]/10 text-[#37404A] hover:bg-[#37404A]/20 text-xs sm:text-sm">
                                    {submissionCount}
                                  </Badge>
                                </TableCell>
                                <TableCell className="w-[20%]">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={form.is_active}
                                      onCheckedChange={() =>
                                        handleToggleClick(
                                          form.id,
                                          form.is_active
                                        )
                                      }
                                    />
                                    <span
                                      className={`text-xs sm:text-sm ${
                                        form.is_active
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {form.is_active ? "Active" : "Inactive"}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="w-[20%]">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleFormSelect(form)}
                                    className="bg-white hover:bg-gray-100 text-[#37404A] border-gray-300 rounded-md text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                                  >
                                    View Submissions
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              </>
            )}

            {/* Submissions Section */}
            {showSubmissions && selectedForm && (
              <section className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-xl sm:text-[24px] font-[500] text-[#37404A]">
                    {selectedForm.title} Submissions
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setShowSubmissions(false)}
                    className="bg-white hover:bg-gray-100 text-[#37404A] border-gray-300 rounded-md flex items-center gap-2 text-xs sm:text-sm cursor-pointer self-start"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Dashboard
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto flex flex-grow items-center">
                      <div className="relative flex-grow">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Search submissions..."
                          value={filters.search}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchKeyDown}
                          className="pl-8 border-gray-300 text-sm w-full"
                          aria-label="Search submissions"
                          autoComplete="off"
                        />
                        {filters.search && (
                          <button
                            type="button"
                            onClick={() => {
                              setFilters({
                                ...filters,
                                search: "",
                              });
                              // Don't auto-search when clearing
                            }}
                            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                            aria-label="Clear search"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSearchSubmit}
                        className="ml-2 text-xs sm:text-sm cursor-pointer whitespace-nowrap h-8 sm:h-9"
                        aria-label="Search"
                        disabled={
                          searchLoading || loading || !filters.search.trim()
                        }
                      >
                        {searchLoading ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <Search className="h-3.5 w-3.5 mr-1 sm:hidden" />
                        )}
                        <span>{searchLoading ? "Searching..." : "Search"}</span>
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setFilterDialogOpen(true)}
                      className="flex items-center gap-2 border-gray-300 text-xs sm:text-sm cursor-pointer"
                      disabled={loading}
                    >
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </div>

                  <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 rounded-full text-center sm:text-right">
                    {pagination.total} total submissions
                  </div>
                </div>

                {/* Filters section */}
                {filters.startDate || filters.endDate ? (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <div className="text-xs sm:text-sm">Filters:</div>
                    {filters.startDate && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        From: {new Date(filters.startDate).toLocaleDateString()}
                      </Badge>
                    )}
                    {filters.endDate && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        To: {new Date(filters.endDate).toLocaleDateString()}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFilterReset}
                      className="h-7 px-2 text-xs cursor-pointer"
                    >
                      Clear
                    </Button>
                  </div>
                ) : null}

                {/* Responsive Table Container */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        {getTableHeaders(selectedForm.form_type).map(
                          (header) => (
                            <TableHead
                              key={header.key}
                              className="font-medium text-[#37404A] cursor-pointer hover:text-[#37404A]/70 text-xs sm:text-sm whitespace-nowrap"
                              onClick={() => handleSortChange(header.key)}
                            >
                              <div className="flex items-center">
                                {header.label}
                                {sorting.field === header.key && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`ml-1 h-3 w-3 sm:h-4 sm:w-4 ${
                                      sorting.order === "desc"
                                        ? "transform rotate-180"
                                        : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 11l5-5 5 5m0 2l-5 5-5-5"
                                    />
                                  </svg>
                                )}
                              </div>
                            </TableHead>
                          )
                        )}
                        <TableHead className="font-medium text-[#37404A] text-right w-[80px] text-xs sm:text-sm whitespace-nowrap">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.length > 0 ? (
                        submissions.map((submission) => (
                          <TableRow key={submission.id}>
                            {getTableHeaders(selectedForm.form_type).map(
                              (header) => (
                                <TableCell
                                  key={`${submission.id}-${header.key}`}
                                  className="text-xs sm:text-sm"
                                >
                                  {getSubmissionValue(submission, header.key)}
                                </TableCell>
                              )
                            )}
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(submission)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer p-1 sm:p-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4"
                                >
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                  <line x1="10" y1="11" x2="10" y2="17"></line>
                                  <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={
                              getTableHeaders(selectedForm.form_type).length + 1
                            }
                            className="text-center py-8 text-xs sm:text-sm"
                          >
                            {loading ? (
                              <div className="flex justify-center">
                                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-gray-400" />
                              </div>
                            ) : (
                              "No submissions found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-4 flex justify-center overflow-x-auto">
                    <Pagination>
                      <PaginationContent className="flex flex-wrap justify-center">
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              pagination.page > 1 &&
                              handlePageChange(pagination.page - 1)
                            }
                            className={
                              pagination.page <= 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                        {pagination.totalPages <= 5 ? (
                          // Show all pages if 5 or fewer
                          Array.from({ length: pagination.totalPages }).map(
                            (_, index) => (
                              <PaginationItem key={index}>
                                <PaginationLink
                                  isActive={pagination.page === index + 1}
                                  onClick={() => handlePageChange(index + 1)}
                                  className="text-xs sm:text-sm"
                                >
                                  {index + 1}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          )
                        ) : (
                          // Show limited pages if more than 5
                          <>
                            {/* Always show first page */}
                            <PaginationItem>
                              <PaginationLink
                                isActive={pagination.page === 1}
                                onClick={() => handlePageChange(1)}
                                className="text-xs sm:text-sm"
                              >
                                1
                              </PaginationLink>
                            </PaginationItem>

                            {/* Show ellipsis if not on first 3 pages */}
                            {pagination.page > 3 && (
                              <PaginationItem>
                                <div className="flex h-9 w-9 items-center justify-center text-xs sm:text-sm">
                                  ...
                                </div>
                              </PaginationItem>
                            )}

                            {/* Show current page and adjacent pages */}
                            {pagination.page !== 1 &&
                              pagination.page !== pagination.totalPages && (
                                <PaginationItem>
                                  <PaginationLink
                                    isActive={true}
                                    className="text-xs sm:text-sm"
                                  >
                                    {pagination.page}
                                  </PaginationLink>
                                </PaginationItem>
                              )}

                            {/* Show ellipsis if not on last 3 pages */}
                            {pagination.page < pagination.totalPages - 2 && (
                              <PaginationItem>
                                <div className="flex h-9 w-9 items-center justify-center text-xs sm:text-sm">
                                  ...
                                </div>
                              </PaginationItem>
                            )}

                            {/* Always show last page */}
                            <PaginationItem>
                              <PaginationLink
                                isActive={
                                  pagination.page === pagination.totalPages
                                }
                                onClick={() =>
                                  handlePageChange(pagination.totalPages)
                                }
                                className="text-xs sm:text-sm"
                              >
                                {pagination.totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              pagination.page < pagination.totalPages &&
                              handlePageChange(pagination.page + 1)
                            }
                            className={
                              pagination.page >= pagination.totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 sm:py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Codekaro Forms Admin Panel. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Confirm Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md rounded-lg max-w-[95vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#37404A] text-lg sm:text-xl">
              Confirm Status Change
            </DialogTitle>
            <DialogDescription className="text-sm">
              {formToToggle && (
                <>
                  Are you sure you want to{" "}
                  {formToToggle.currentStatus ? "deactivate" : "activate"} this
                  form?
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Status message outside of DialogDescription to avoid nested p tags */}
          {formToToggle && (
            <div
              className={
                formToToggle.currentStatus
                  ? "text-red-600 mt-2 p-2 sm:p-3 bg-red-50 rounded-md border border-red-100 text-xs sm:text-sm"
                  : "text-green-600 mt-2 p-2 sm:p-3 bg-green-50 rounded-md border border-green-100 text-xs sm:text-sm"
              }
            >
              {formToToggle.currentStatus
                ? "When inactive, users will not be able to submit this form."
                : "When active, users will be able to submit this form."}
            </div>
          )}

          <DialogFooter className="flex justify-end gap-2 sm:justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleConfirmToggle(false)}
              className="border-gray-300 text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleConfirmToggle(true)}
              className={
                formToToggle?.currentStatus
                  ? "bg-red-600 hover:bg-red-700 text-xs sm:text-sm cursor-pointer"
                  : "bg-green-600 hover:bg-green-700 text-xs sm:text-sm cursor-pointer"
              }
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteConfirmModal}
        onOpenChange={setShowDeleteConfirmModal}
      >
        <DialogContent className="sm:max-w-md rounded-lg max-w-[95vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-[#37404A] text-lg sm:text-xl">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-sm">
              {submissionToDelete && (
                <>Are you sure you want to delete this submission?</>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Warning message */}
          <div className="text-red-600 mt-2 p-2 sm:p-3 bg-red-50 rounded-md border border-red-100 text-xs sm:text-sm">
            This action cannot be undone. The submission will be permanently
            deleted from the database.
          </div>

          <DialogFooter className="flex justify-end gap-2 sm:justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleConfirmDelete(false)}
              className="border-gray-300 text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleConfirmDelete(true)}
              className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Filter Submissions
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Set date range to filter submissions
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
              <label className="text-right text-xs sm:text-sm">From</label>
              <div className="col-span-3">
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-2 sm:gap-4">
              <label className="text-right text-xs sm:text-sm">To</label>
              <div className="col-span-3">
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFilterReset}
              className="text-xs sm:text-sm cursor-pointer"
            >
              Reset
            </Button>
            <Button
              onClick={handleFilterApply}
              size="sm"
              className="text-xs sm:text-sm cursor-pointer"
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Full Text Dialog */}
      <Dialog
        open={fullTextModal.isOpen}
        onOpenChange={(open) =>
          setFullTextModal((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-w-[95vw] p-4 sm:p-6">
          <DialogHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-[#37404A] text-lg sm:text-xl font-medium">
                {fullTextModal.title}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="mt-4 p-3 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto shadow-inner">
            {fullTextModal.content &&
              fullTextModal.content.split(/\n+/).map((paragraph, index) =>
                paragraph.trim() ? (
                  <p
                    key={index}
                    className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-3 last:mb-0 break-words whitespace-normal"
                    style={{ maxWidth: "100%", wordWrap: "break-word" }}
                  >
                    {paragraph}
                  </p>
                ) : null
              )}
          </div>

          <DialogFooter className="mt-4 pt-2 border-t">
            <Button
              onClick={() =>
                setFullTextModal((prev) => ({ ...prev, isOpen: false }))
              }
              size="sm"
              className="bg-[#37404A] hover:bg-[#37404A]/90 transition-colors text-xs sm:text-sm cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
