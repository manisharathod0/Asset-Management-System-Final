import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ScheduledMaintenance = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        assetId: "",
        assetName: "",
        date: "",
        technician: "",
        task: "",
        status: "scheduled",
    });
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [assetsLoading, setAssetsLoading] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            setAssetsLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/maintenance/pending");
                console.log("Fetched assets:", response.data); // Debugging log
                setAssets(response.data);
            } catch (err) {
                console.error("Error fetching assets", err);
                setError("Failed to fetch assets.");
            } finally {
                setAssetsLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "asset") {
            const selectedAsset = assets.find((asset) => asset._id === value);
            setFormData({
                ...formData,
                assetId: selectedAsset._id,
                assetName: selectedAsset.assetName,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        if (!formData.assetId || !formData.date || !formData.technician || !formData.task) {
            setError("All fields are required.");
            setLoading(false);
            return;
        }
    
        try {
            console.log("Data being sent:", formData);
            const response = await axios.post(
                "http://localhost:5000/api/maintenance/scheduled-maintenance",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Server Response:", response.data);
    
            const confirmed = window.confirm("Asset scheduled successfully. Do you want to proceed?");
    
            if (confirmed) {
                navigate("/admin/request-repair");
            }
    
        } catch (err) {
            setError("Failed to schedule maintenance.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6 mt-5">
            <div className="max-w-lg w-full bg-white bg-opacity-90 backdrop-blur-md p-8 shadow-xl rounded-xl border border-gray-300">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Schedule Maintenance</h2>

                {error && <p className="text-red-500 font-medium text-center mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Asset Selection */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Asset ID & Name</label>
                        <select
                            name="asset"
                            value={formData.assetId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
                        >
                            <option value="">Select an Asset</option>
                            {assetsLoading ? (
                                <option disabled>Loading...</option>
                            ) : (
                                assets.map((asset) => (
                                    <option key={asset._id} value={asset._id}>
                                        {asset._id} - {asset.assetName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Date Input */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Maintenance Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
                        />
                    </div>

                    {/* Technician Name */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Technician Name</label>
                        <input
                            type="text"
                            name="technician"
                            value={formData.technician}
                            onChange={handleChange}
                            placeholder="Enter technician name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Description</label>
                        <textarea
                            name="task"
                            value={formData.task}
                            onChange={handleChange}
                            placeholder="Describe the maintenance task"
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#001F3F] hover:bg-blue-600 shadow-md"
                        }`}
                        disabled={loading || !formData.assetId || !formData.date}
                    >
                        {loading ? "Scheduling..." : "Schedule Maintenance"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduledMaintenance;
