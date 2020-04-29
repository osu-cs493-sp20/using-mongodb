/*
 * Lodgings schema and data accessor methods.
 */

const { extractValidFields } = require('../lib/validation');
const { getDBReference } = require('../lib/mongo');

/*
 * Schema for a lodging.
 */
exports.LodgingSchema = {
  name: { required: true },
  description: { required: false },
  street: { required: true },
  city: { required: true },
  state: { required: true },
  zip: { required: true },
  price: { required: true },
  ownerid: { required: true }
};

exports.getLodgingsPage = async function (page) {
  const pageSize = 10;

  const db = getDBReference();
  const collection = db.collection('lodgings');

  const count = await collection.countDocuments();
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    lodgings: results,
    page: page,
    totalPages: lastPage,
    pageSize: pageSize,
    count: count
  };
};

exports.insertNewLodging = async function (lodging) {
  const validatedLodging = extractValidFields(
    lodging,
    exports.LodgingSchema
  );

  const db = getDBReference();
  const collection = db.collection('lodgings');
  const result = await collection.insertOne(validatedLodging);

  return result.insertedId;
};
