import UnitFile from '../models/unitFile.model.js';
import Resident from '../models/resident.model.js';
import errorHandler from '../utils/error.js';

export const create = async (req, res, next) => {
  try {
    const { unitNumber, residents, licensePlate, spotDetails } = req.body;

    if (!unitNumber || !residents || !Array.isArray(residents)) {
      return next(errorHandler(400, 'Must have resident complete details'));
    }

    const residentIds = await Promise.all(
      residents.map(async (residentData) => {
        const resident = new Resident(residentData);
        await resident.save();
        return resident._id;
      }),
    );

    const unitFile = new UnitFile({
      unitNumber,
      residents: residentIds,
      licensePlate,
      spotDetails,
    });

    await unitFile.save();
    res.status(201).json(unitFile);
  } catch (error) {
    next(error);
  }
};

export const getUnitFiles = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 6;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const searchTerm = req.query.searchTerm ? req.query.searchTerm : '';

    const searchTermQuery = searchTerm
      ? {
          $or: [
            { unitNumber: { $regex: searchTerm, $options: 'i' } },
            { 'residents.name': { $regex: searchTerm, $options: 'i' } },
            { 'residents.email': { $regex: searchTerm, $options: 'i' } },
            { 'residents.phone': { $regex: searchTerm, $options: 'i' } },
            { 'residents.residentType': { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const unitFiles = await UnitFile.find({
      ...searchTermQuery,
      ...(req.query.unitNumber && { unitNumber: req.query.unitNumber }),
      ...(req.query.unitFileId && { _id: req.query.unitFileId }),
    })
      .populate('residents')
      .sort({ unitNumber: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalUnits = await UnitFile.countDocuments();
    const totalRegisteredResidents = await Resident.countDocuments();

    res.status(200).json({ unitFiles, totalUnits, totalRegisteredResidents });
  } catch (error) {
    next(error);
  }
};

export const updateUnitFile = async (req, res, next) => {
  try {
    const { id: unitFileId } = req.params;
    const { unitNumber, residents, licensePlate, spotDetails } = req.body;

    const residentIds = await Promise.all(
      residents.map(async (residentData) => {
        if (residentData._id) {
          const updatedResident = await Resident.findByIdAndUpdate(
            residentData._id,
            residentData,
            { new: true },
          );
          return updatedResident._id;
        } else {
          const newResident = new Resident(residentData);
          await newResident.save();
          return newResident._id;
        }
      }),
    );

    const updatedUnitFile = await UnitFile.findByIdAndUpdate(
      unitFileId,
      {
        unitNumber,
        residents: residentIds,
        licensePlate,
        spotDetails,
      },
      { new: true },
    ).populate('residents');

    res.status(200).json({ updatedUnitFile });
  } catch (error) {
    next(error);
  }
};
