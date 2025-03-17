
import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const AssetCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      console.log("Fetched Categories:", response.data); // Debugging
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Ensure it's always an array
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() !== "" && !categories.some(cat => cat.name === newCategory)) {
      try {
        await axios.post("http://localhost:5000/api/categories", { name: newCategory });
        fetchCategories(); // Refresh the list
        setNewCategory("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`/http://localhost:5000/api/categories/${id}`);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-lg mx-auto mt-16">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Asset Categories</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter new category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 flex-grow rounded-lg"
        />
        <button
          onClick={handleAddCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
      <ul className="list-none p-0">
        {categories?.length > 0 ? (
          categories.map((category) => (
            <li key={category._id} className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded-lg shadow">
              <span className="text-gray-700 font-medium">{category.name}</span>
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                <FaTrash />
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories available</p>
        )}
      </ul>
    </div>
  );
};

export default AssetCategories;