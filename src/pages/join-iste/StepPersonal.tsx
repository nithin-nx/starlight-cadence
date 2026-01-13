const StepPersonal = ({ data, setData, next }: any) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Personal Details</h2>

      <Input label="Full Name" value={data.full_name}
        onChange={(v) => setData({ ...data, full_name: v })} />

      <Input label="Email" type="email" value={data.email}
        onChange={(v) => setData({ ...data, email: v })} />

      <Input label="Phone Number" value={data.phone}
        onChange={(v) => setData({ ...data, phone: v })} />

      <Input label="Date of Birth" type="date" value={data.dob}
        onChange={(v) => setData({ ...data, dob: v })} />

      <button onClick={next} className="btn-primary mt-6 w-full">
        Next
      </button>
    </>
  );
};

const Input = ({ label, value, onChange, type = "text" }: any) => (
  <div className="mb-4">
    <label className="block mb-2 text-gray-400">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input"
      required
    />
  </div>
);

export default StepPersonal;
