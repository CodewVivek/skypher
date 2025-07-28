import React, { useState, useEffect } from "react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";
import { Copy, Check, Share2, X, ExternalLink } from "lucide-react";

const Share = ({ projectSlug, projectName = "this project" }) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // You can easily change this when you get your domain
  const baseUrl = window.location.origin; // Use current domain
  const shareUrl = `${baseUrl}/launches/${projectSlug}`;
  const title = `Check out ${projectName} on LaunchIt!`;

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Share Button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium hover:scale-105 active:scale-95"
        aria-label="Share project"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Share Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {projectName}
                </h2>
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                  Share Project
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-7 h-7 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Copy Link Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Link
              </label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-600 dark:text-gray-300"
                  aria-label="Project share link"
                />
                <div className="flex gap-1">
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                      copied
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800"
                    }`}
                    title={copied ? "Link copied!" : "Copy link"}
                    aria-label="Copy project link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-600 transition-all duration-200"
                    title="Open project link"
                    aria-label="Open project link in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </a>
                </div>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Share via social media
              </label>
              <div className="grid grid-cols-5 gap-3">
                <TwitterShareButton
                  url={shareUrl}
                  title={title}
                  className="transition-transform hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-1">
                    <TwitterIcon size={32} round className="shadow-sm" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      X
                    </span>
                  </div>
                </TwitterShareButton>

                <FacebookShareButton
                  url={shareUrl}
                  quote={title}
                  className="transition-transform hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-1">
                    <FacebookIcon size={32} round className="shadow-sm" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Facebook
                    </span>
                  </div>
                </FacebookShareButton>

                <LinkedinShareButton
                  url={shareUrl}
                  title={title}
                  className="transition-transform hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-1">
                    <LinkedinIcon size={32} round className="shadow-sm" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      LinkedIn
                    </span>
                  </div>
                </LinkedinShareButton>

                <WhatsappShareButton
                  url={shareUrl}
                  title={title}
                  className="transition-transform hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-1">
                    <WhatsappIcon size={32} round className="shadow-sm" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      WhatsApp
                    </span>
                  </div>
                </WhatsappShareButton>

                <EmailShareButton
                  url={shareUrl}
                  subject={title}
                  className="transition-transform hover:scale-110"
                >
                  <div className="flex flex-col items-center gap-1">
                    <EmailIcon size={32} round className="shadow-sm" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Email
                    </span>
                  </div>
                </EmailShareButton>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              💡 Tip: Share this project to help it reach more people!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Share;
