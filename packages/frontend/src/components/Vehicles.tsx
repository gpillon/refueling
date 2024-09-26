import React, { useState, useEffect } from 'react';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/api';
import { Vehicle, NewVehicle } from '../types';
import { useTranslation } from 'react-i18next';

const Vehicles: React.FC = () => {
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newVehicle, setNewVehicle] = useState<NewVehicle>({ make: '', model: '', year: new Date().getFullYear(), plate: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      const data = await getVehicles();
      console.log('Fetched vehicles:', data);
      if (Array.isArray(data)) {
        setVehicles(data);
      } else {
        console.error('Unexpected data format:', data);
        setVehicles([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to fetch vehicles. Please try again later.');
      setVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVehicle(newVehicle);
      setNewVehicle({ make: '', model: '', year: new Date().getFullYear(), plate: '', type: '' });
      fetchVehicles();
    } catch (err) {
      setError('Failed to create vehicle. Please try again.');
      console.error('Error creating vehicle:', err);
    }
  };

  const handleUpdateVehicle = async (id: number, updatedData: Partial<Vehicle>) => {
    try {
      await updateVehicle(id, updatedData);
      fetchVehicles();
      setEditingId(null);
      setEditedVehicle(null);
    } catch (err) {
      setError('Failed to update vehicle. Please try again.');
      console.error('Error updating vehicle:', err);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditedVehicle(vehicle);
  };

  const handleSave = () => {
    if (editedVehicle) {
      handleUpdateVehicle(editedVehicle.id, editedVehicle);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    try {
      await deleteVehicle(id);
      fetchVehicles();
    } catch (err) {
      setError('Failed to delete vehicle. Please try again.');
      console.error('Error deleting vehicle:', err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center text-xl mt-8">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{t('vehicles')}</h1>
      <form onSubmit={handleCreateVehicle} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="make" className="block text-gray-700 text-sm font-bold mb-2">
            {t('make')}:
          </label>
          <input
            id="make"
            type="text"
            placeholder={t('make')}
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="model" className="block text-gray-700 text-sm font-bold mb-2">
            {t('model')}:
          </label>
          <input
            id="model"
            type="text"
            placeholder={t('model')}
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="plate" className="block text-gray-700 text-sm font-bold mb-2">
            {t('plate')}:
          </label>
          <input
            id="plate"
            type="text"
            placeholder={t('plate')}
            value={newVehicle.plate}
            onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
            {t('type')}:
          </label>
          <input
            id="type"
            type="text"
            placeholder={t('type')}
            value={newVehicle.type}
            onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="year" className="block text-gray-700 text-sm font-bold mb-2">
            {t('year')}:
          </label>
          <input
            id="year"
            type="number"
            placeholder={t('year')}
            value={newVehicle.year}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min={1900}
            max={new Date().getFullYear()}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          {t('addVehicle')}
        </button>
      </form>
      {vehicles.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">{t('noVehiclesFound')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              {editingId === vehicle.id ? (
                <>
                  <div className="mb-4">
                    <label htmlFor={`edit-make-${vehicle.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('make')}:
                    </label>
                    <input
                      id={`edit-make-${vehicle.id}`}
                      type="text"
                      value={editedVehicle?.make || ''}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle!, make: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`edit-model-${vehicle.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('model')}:
                    </label>
                    <input
                      id={`edit-model-${vehicle.id}`}
                      type="text"
                      value={editedVehicle?.model || ''}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle!, model: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`edit-year-${vehicle.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('year')}:
                    </label>
                    <input
                      id={`edit-year-${vehicle.id}`}
                      type="number"
                      value={editedVehicle?.year || ''}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle!, year: parseInt(e.target.value) })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`edit-plate-${vehicle.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('plate')}:
                    </label>
                    <input
                      id={`edit-plate-${vehicle.id}`}
                      type="text"
                      value={editedVehicle?.plate || ''}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle!, plate: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor={`edit-type-${vehicle.id}`} className="block text-gray-700 text-sm font-bold mb-2">
                      {t('type')}:
                    </label>
                    <input
                      id={`edit-type-${vehicle.id}`}
                      type="text"
                      value={editedVehicle?.type || ''}
                      onChange={(e) => setEditedVehicle({ ...editedVehicle!, type: e.target.value })}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">{vehicle.make} {vehicle.model}</h2>
                  <p className="text-gray-700 mb-4">{t('year')}: {vehicle.year}</p>
                  <p className="text-gray-700 mb-4">{t('plate')}: {vehicle.plate}</p>
                  <p className="text-gray-700 mb-4">{t('type')}: {vehicle.type}</p>
                </>
              )}
              <div className="flex justify-between">
                {editingId === vehicle.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t('save')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t('edit')}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;