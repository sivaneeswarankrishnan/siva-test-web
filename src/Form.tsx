import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Slider } from "@mui/material";
import "./css/Form.css";

// Define the structure of form values
interface FormValues {
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
}

const ActivityForm: React.FC = () => {
  // Initialize form handling with react-hook-form
  const { register, handleSubmit, control, reset } = useForm<FormValues>();
  
  // Load saved items from localStorage immediately to prevent reset on refresh
  const [items, setActivities] = useState<FormValues[]>(() => {
    const storedActivities = localStorage.getItem("items");
    return storedActivities ? JSON.parse(storedActivities) : [];
  });

  // Save items to localStorage whenever the list updates
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  // Function to handle form submission and add new activity to the list
  const onSubmit = (data: FormValues) => {
    setActivities([...items, { ...data, price: Number(data.price) }]);
    reset(); // Reset form fields after submission
  };

  // Function to remove an activity from the list by index
  const removeActivity = (index: number) => {
    const updatedActivities = items.filter((_, i) => i !== index);
    setActivities(updatedActivities);
  };

  return (
    <div className="form-wrapper">
      {/* Display the total count of items */}
      <h2>Total Activities: {items.length}</h2>
      
      {/* Form for adding a new activity */}
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <div className="form-group">
          <label>Activity</label>
          <input {...register("activity")} type="text" required />
        </div>

        <div className="form-group">
          <label>Price (RM)</label>
          <input {...register("price")} type="number" step="0.01" required />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select {...register("type")} required>
            <option value="education">Education</option>
            <option value="recreational">Recreational</option>
            <option value="social">Social</option>
            <option value="diy">DIY</option>
            <option value="charity">Charity</option>
            <option value="cooking">Cooking</option>
            <option value="relaxation">Relaxation</option>
            <option value="music">Music</option>
            <option value="busywork">Busywork</option>
          </select>
        </div>

        <div className="checkbox-group">
          <input {...register("bookingRequired")} type="checkbox" />
          <label>Booking Required</label>
        </div>

        <div className="form-group">
          <label>Accessibility</label>
          <Controller
            name="accessibility"
            control={control}
            defaultValue={0.5}
            render={({ field }) => (
              <Slider {...field} min={0} max={1} step={0.1} valueLabelDisplay="auto" />
            )}
          />
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>

      {/* Display the list of items */}
      <ul className="activity-list">
        {items.map((activity, index) => (
          <li key={index} className="activity-item">
            <span>
              <strong>Activity:</strong> {activity.activity} <br />
              <strong>Price:</strong> RM{Number(activity.price).toFixed(2)} <br />
              <strong>Type:</strong> {activity.type} <br />
              <strong>Booking Required:</strong> {activity.bookingRequired ? "Yes" : "No"} <br />
              <strong>Accessibility:</strong> {activity.accessibility.toFixed(1)}
            </span>
            <button className="delete-button" onClick={() => removeActivity(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityForm;