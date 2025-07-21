export default function EditDeviceModal({
  setShowDeviceModal,
  modalType,
}: {
  setShowDeviceModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Transparent dark backdrop */}
      <button
        onClick={() => setShowDeviceModal(false)}
        className="absolute inset-0 bg-slate-900 opacity-10 pointer-events-auto cursor-pointer"
      />

      {/* Modal content */}
      {modalType === "edit" ? (
        <div className="relative bg-white text-black p-6 rounded shadow-md z-10 pointer-events-auto">
          <h2 className="text-xl font-bold mb-4">Edit Device</h2>
          <p>Your content here</p>
        </div>
      ) : (
        <div className="relative bg-white text-black p-6 rounded shadow-md z-10 pointer-events-auto">
          <h2 className="text-xl font-bold mb-4">Add New Device</h2>
          <p>Your content here</p>
        </div>
      )}
    </div>
  );
}
