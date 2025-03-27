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
    
        // Frontend validation: Check all fields
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
    
            // Display confirmation prompt
            const confirmed = window.confirm("Asset scheduled successfully. Do you want to proceed?");
    
            if (confirmed) {
                navigate("/admin/request-repair");
            }
    
        } catch (err) {
            // ... (error handling)
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="min-h-screen bg-gray-100 pt-30 px-4">
            <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">Schedule Maintenance</h2>
                {error && <p className="text-red-500">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Asset ID & Name</label>
                        <select
                            name="asset"
                            value={formData.assetId}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
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
                    <div>
                        <label className="block text-sm font-medium">Maintenance Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Technician Name</label>
                        <input
                            type="text"
                            name="technician"
                            value={formData.technician}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Description</label>
                        <textarea
                            name="task"
                            value={formData.task}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
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