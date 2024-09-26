import React, { useState, useEffect } from 'react';
import { getRefuelings, createRefueling, updateRefueling, deleteRefueling, getVehicles } from '../services/api';
import { Refueling, Vehicle, NewRefueling, FuelType } from '../types';
import { useTranslation } from 'react-i18next';

const getOneMonthAgo = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };
  
  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

const Refuelings: React.FC = () => {
  const { t } = useTranslation();
  const [refuelings, setRefuelings] = useState<Refueling[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [newRefueling, setNewRefueling] = useState<NewRefueling>({ date: '', liters: 0, cost: 0, kilometers: 0, vehicleId: 0, fuelType: FuelType.GASOLINE });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedRefueling, setEditedRefueling] = useState<Refueling | null>(null);
  const [startDate, setStartDate] = useState<string>(getOneMonthAgo());
  const [endDate, setEndDate] = useState<string>(getCurrentDate());
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | ''>('');
  
  const mySetStartDate = (date: string) => {
    
    setStartDate(date);
    if (date > endDate) {
      setEndDate(date);
    }
    fetchRefuelings();
  };

  const mySetEndDate = (date: string) => {
    setEndDate(date);
    if (date < startDate) {
      setStartDate(date);
    }
    fetchRefuelings();
  };

  useEffect(() => {
    fetchRefuelingsAndVehicles();
  }, []);

  const fetchRefuelingsAndVehicles = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchRefuelings(), fetchVehicles()]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRefuelings = async () => {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });
      if (selectedVehicleId !== '') {
        params.append('vehicleId', selectedVehicleId.toString());
      }
      const data = await getRefuelings(params);
      if (Array.isArray(data)) {
        setRefuelings(data);
      } else {
        console.error('Unexpected data format:', data);
        setRefuelings([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching refuelings:', err);
      setError('Failed to fetch refuelings. Please try again later.');
      setRefuelings([]);
    }
  };

  const fetchVehicles = async () => {
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
    }
  };

  const handleCreateRefueling = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRefueling(newRefueling);
      setNewRefueling({ date: '', liters: 0, cost: 0, kilometers: 0, vehicleId: 0, fuelType: FuelType.GASOLINE });
      fetchRefuelings();
    } catch (err) {
      setError('Failed to create refueling. Please try again.');
      console.error('Error creating refueling:', err);
    }
  };

  const handleUpdateRefueling = async (id: number, updatedData: Partial<Refueling>) => {
    try {
      await updateRefueling(id, updatedData);
      fetchRefuelings();
      setEditingId(null);
      setEditedRefueling(null);
    } catch (err) {
      setError('Failed to update refueling. Please try again.');
      console.error('Error updating refueling:', err);
    }
  };

  const handleEdit = (refueling: Refueling) => {
    setEditingId(refueling.id);
    setEditedRefueling(refueling);
  };

  const handleSave = () => {
    if (editedRefueling) {
      handleUpdateRefueling(editedRefueling.id, editedRefueling);
    }
  };

  const handleDeleteRefueling = async (id: number) => {
    if (window.confirm(t('confirmDeleteRefueling'))) {
      try {
        await deleteRefueling(id);
        fetchRefuelings();
      } catch (err) {
            setError('Failed to delete refueling. Please try again.');
      console.error('Error deleting refueling:', err);
      }
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
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{t('refuelings')}</h1>
      
      <form onSubmit={handleCreateRefueling} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
            {t('date')}:
          </label>
          <input
            id="date"
            type="date"
            value={newRefueling.date}
            onChange={(e) => setNewRefueling({ ...newRefueling, date: e.target.value })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fuelType" className="block text-gray-700 text-sm font-bold mb-2">
            {t('fuelType')}:
          </label>
          <select
            id="fuelType"
            value={newRefueling.fuelType}
            onChange={(e) => setNewRefueling({ ...newRefueling, fuelType: e.target.value as FuelType })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value={FuelType.GASOLINE}>{t('gasoline')}</option>
            <option value={FuelType.DIESEL}>{t('diesel')}</option>
            <option value={FuelType.ELECTRIC}>{t('electric')}</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="liters" className="block text-gray-700 text-sm font-bold mb-2">
            {t('liters')}:
          </label>
          <input
            id="liters"
            type="number"
            placeholder={t('liters')}
            value={newRefueling.liters}
            onChange={(e) => setNewRefueling({ ...newRefueling, liters: parseFloat(e.target.value) })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="cost" className="block text-gray-700 text-sm font-bold mb-2">
            {t('cost')}:
          </label>
          <input
            id="cost"
            type="number"
            placeholder={t('cost')}
            value={newRefueling.cost}
            onChange={(e) => setNewRefueling({ ...newRefueling, cost: parseFloat(e.target.value) })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="kilometers" className="block text-gray-700 text-sm font-bold mb-2">
            {t('kilometers')}:
          </label>
          <input
            id="kilometers"
            type="number"
            placeholder={t('kilometers')}
            value={newRefueling.kilometers}
            onChange={(e) => setNewRefueling({ ...newRefueling, kilometers: parseFloat(e.target.value) })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="vehicleId" className="block text-gray-700 text-sm font-bold mb-2">
            {t('vehicle')}:
          </label>
          <select
            id="vehicleId"
            value={newRefueling.vehicleId}
            onChange={(e) => setNewRefueling({ ...newRefueling, vehicleId: parseInt(e.target.value) })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">{t('selectVehicle')}</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          {t('addRefueling')}
        </button>
      </form>
      {/* Filter fields */}
      <div className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
              {t('startDate')}:
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => {e.preventDefault(); mySetStartDate(e.target.value)}}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
              {t('endDate')} <a className="text-blue-500 hover:text-blue-700" href="#" onClick={(e) => { e.preventDefault(); setEndDate(getCurrentDate()); setStartDate(getOneMonthAgo()); fetchRefuelings(); }}>({t('lastMonth')})</a>:
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => {e.preventDefault(); mySetEndDate(e.target.value)}}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <label htmlFor="vehicleId" className="block text-gray-700 text-sm font-bold mb-2">
              {t('vehicleOptional')}:
            </label>
            <select
              id="vehicleId"
              value={selectedVehicleId}
              onChange={(e) => {e.preventDefault(); setSelectedVehicleId(e.target.value === '' ? '' : parseInt(e.target.value))}}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">{t('allVehicles')}</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.plate} ({vehicle.year})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={fetchRefuelings}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {t('applyFilters')}
        </button>
      </div>

      {refuelings.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">{t('noRefuelingsFound')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {refuelings.map((refueling) => (
            <div key={refueling.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              {editingId === refueling.id ? (
                <>
                  <input
                    type="date"
                    value={new Date(editedRefueling?.date || '').toISOString().split('T')[0] }
                    onChange={(e) => setEditedRefueling({ ...editedRefueling!, date: e.target.value })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  />
                  <select
                    value={editedRefueling?.fuelType || ''}
                    onChange={(e) => setEditedRefueling({ ...editedRefueling!, fuelType: e.target.value as FuelType })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                  >
                    <option value={FuelType.GASOLINE}>{t('gasoline')}</option>
                    <option value={FuelType.DIESEL}>{t('diesel')}</option>
                    <option value={FuelType.ELECTRIC}>{t('electric')}</option>
                  </select>
                  <input
                    type="number"
                    value={editedRefueling?.liters || 0}
                    onChange={(e) => setEditedRefueling({ ...editedRefueling!, liters: parseFloat(e.target.value) })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    step="0.01"
                    min="0"
                  />
                  <input
                    type="number"
                    value={editedRefueling?.cost || 0}
                    onChange={(e) => setEditedRefueling({ ...editedRefueling!, cost: parseFloat(e.target.value) })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    step="0.01"
                    min="0"
                  />
                  <input
                    type="number"
                    value={editedRefueling?.kilometers || 0}
                    onChange={(e) => setEditedRefueling({ ...editedRefueling!, kilometers: parseFloat(e.target.value) })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                    step="0.01"
                    min="0"
                  />

                  <select
                    value={editedRefueling?.vehicleId || ''}
                    onChange={(e) => setEditedRefueling({ ...editedRefueling!, vehicleId: parseInt(e.target.value) })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                  >
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} - {vehicle.plate} ({vehicle.year})
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-2">{t('refuelingOn', { date: new Date(refueling.date).toISOString().split('T')[0] })}</h2>
                  <p className="text-gray-700 mb-1">{t('fuelType')}: {t(refueling.fuelType.toLowerCase())}</p>
                  <p className="text-gray-700 mb-1">{t('liters')}: {refueling.liters.toFixed(2)}</p>
                  <p className="text-gray-700 mb-1">{t('cost')}: {refueling.cost.toFixed(2)} €</p>
                  <p className="text-gray-700 mb-1">{t('kilometers')}: {refueling.kilometers.toFixed(0)}</p>
                  <p className="text-gray-700 mb-4">
                    {t('vehicle')}: {(() => {
                      const vehicle = vehicles.find(v => v.id === refueling.vehicleId);
                      return vehicle ? `${vehicle.make} ${vehicle.model} - ${vehicle.plate}` : t('unknown');
                    })()}
                  </p>
                </>
              )}
              <div className="flex justify-between">
                {editingId === refueling.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t('save')}
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(refueling)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {t('edit')}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteRefueling(refueling.id)}
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

export default Refuelings;