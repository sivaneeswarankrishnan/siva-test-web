import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Slider } from "@mui/material";
import axios from "axios";
import "./css/Form.css";

interface FormValues {
  _id?: string; // MongoDB ID
  activity: string;
  price: number;
  type: string;
  bookingRequired: boolean;
  accessibility: number;
}

const API_URL = "http://localhost:5000/activities"; // Change to your backend URL

const ActivityForm: React.FC = () => {
  const { register, handleSubmit, control, reset } = useForm<FormValues>();
  const [activities, setActivities] = useState<FormValues[]>([]);

  useEffect(() => {
    axios.get(API_URL)
      .then((response: { data: React.SetStateAction<FormValues[]>; }) => setActivities(response.data))
      .catch((error: any) => console.error("Error fetching activities:", error));
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(API_URL, data);
      setActivities([...activities, response.data]);
      reset();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  const removeActivity = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setActivities(activities.filter(activity => activity._id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div className="form-wrapper">
      <h2>Total Activities: {activities.length}</h2>

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

      <ul className="activity-list">
        {activities.map((activity) => (
          <li key={activity._id} className="activity-item">
            <span>
              <strong>Activity:</strong> {activity.activity} <br />
              <strong>Price:</strong> RM{Number(activity.price).toFixed(2)} <br />
              <strong>Type:</strong> {activity.type} <br />
              <strong>Booking Required:</strong> {activity.bookingRequired ? "Yes" : "No"} <br />
              <strong>Accessibility:</strong> {activity.accessibility.toFixed(1)}
            </span>
            <button className="delete-button" onClick={() => removeActivity(activity._id!)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityForm;
