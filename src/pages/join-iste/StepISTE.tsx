const StepISTE = ({ data, setData, back, submit, loading }: any) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">ISTE Declaration</h2>

      <label className="block mb-2 text-gray-400">
        Why do you want to join ISTE?
      </label>
      <textarea
        className="input resize-none"
        rows={4}
        value={data.reason}
        onChange={(e) => setData({ ...data, reason: e.target.value })}
        required
      />

      <label className="flex items-center gap-2 mt-4 text-sm">
        <input
          type="checkbox"
          checked={data.declaration}
          onChange={(e) =>
            setData({ ...data, declaration: e.target.checked })
          }
        />
        I confirm that the above details are true.
      </label>

      <div className="flex gap-4 mt-6">
        <button onClick={back} className="btn-secondary w-full">Back</button>
        <button
          disabled={!data.declaration || loading}
          onClick={submit}
          className="btn-primary w-full"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </>
  );
};

export default StepISTE;
