"use client";
import React, { useEffect, useState } from "react";

const Selectdemo = () => {
  const [exam, setExam] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  const loadExam = () => {
    fetch("http://localhost:8000/exam")
      .then((res) => res.json())
      .then(setExam);
  };

  useEffect(() => {
    loadExam();
  }, []);

  const handleEdit = (e) => {
    setEditId(e.id);
    setForm(e);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const subs = ["sub1", "sub2", "sub3", "sub4", "sub5"].map(
      (s) => Number(form[s])
    );
    const total = subs.reduce((a, b) => a + b, 0);
    const average = total / 5;
    const percentage = (total / 500) * 100;

    fetch(`http://localhost:8000/exam/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, total, average, percentage }),
    }).then(() => {
      setEditId(null);
      loadExam();
    });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      fetch(`http://localhost:8000/exam/${id}`, { method: "DELETE" }).then(
        loadExam
      );
    }
  };

  return (
    <div>
      <h2>Exam Results</h2>

      {editId && (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
          />

          {["sub1", "sub2", "sub3", "sub4", "sub5"].map((s, i) => (
            <input
              key={s}
              type="number"
              name={s}
              placeholder={`Subject ${i + 1}`}
              value={form[s]}
              onChange={handleChange}
            />
          ))}

          <button>Update</button>
        </form>
      )}

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>S5</th>
            <th>Total</th>
            <th>Average</th>
            <th>%</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {exam.map((e) => (
            <tr key={e.id}>
              <td>{e.studentName}</td>
              <td>{e.sub1}</td>
              <td>{e.sub2}</td>
              <td>{e.sub3}</td>
              <td>{e.sub4}</td>
              <td>{e.sub5}</td>
              <td>{e.total}</td>
              <td>{e.average}</td>
              <td>{e.percentage}</td>
              <td>
                <button onClick={() => handleEdit(e)}>Edit</button>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Selectdemo;
