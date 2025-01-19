import { DataRow } from "@/types/type";
import { X } from "lucide-react";

interface DomainModalProps {
  domain: DataRow;
  onClose: () => void;
}

const DomainModal = ({ domain, onClose }: DomainModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 pr-8">{domain.domain}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Niche</h3>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2">
                  {domain.niche1}
                </span>
                {domain.niche2 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {domain.niche2}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Language</h3>
              <p className="mt-1 text-sm text-gray-900">{domain.language}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                ${domain.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Traffic</h3>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {domain.traffic.toLocaleString()} visitors
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">DR</h3>
                <div className="mt-1">
                  <span
                    className={`text-lg font-semibold ${
                      domain.dr >= 50
                        ? "text-green-600"
                        : domain.dr >= 30
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {domain.dr}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">DA</h3>
                <div className="mt-1">
                  <span
                    className={`text-lg font-semibold ${
                      domain.da >= 50
                        ? "text-green-600"
                        : domain.da >= 30
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {domain.da}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Spam Score</h3>
              <div className="mt-1">
                <span
                  className={`text-lg font-semibold ${
                    domain.spamScore <= 3
                      ? "text-green-600"
                      : domain.spamScore <= 6
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {domain.spamScore}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainModal;
