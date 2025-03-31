const axios = require('axios');

const { Settings, Zone, PromoCode, Request, DriverLocation, User, Notification, Driver, WalletTransaction, Wallet } = require('../models');

const ApiError = require('./ApiError');
const httpStatus = require('http-status');
const ObjectId = require('mongoose').Types.ObjectId;
const admin = require('firebase-admin');

const getClientId = async (req) => {

    clientId = '';

    if (!req.headers.clientid) {

        throw new ApiError(httpStatus.NOT_FOUND, 'ClientID not found');

    } else {

        clientId = req.headers.clientid;

    }

    return clientId;
}


async function autocompletePlaces(keyword, location) {
    // Replace this with your logic to fetch the API key from settings
    const settingsPlaces = await Settings.findOne({ name: 'geoCoderApiKey' });
    const apiKey = settingsPlaces.value;

    const url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

    try {
        const response = await axios.get(url, {
            params: {
                input: keyword,
                location: location,
                key: apiKey,
            },
        });

        const predictions = response.data.predictions || [];

        const datas = predictions.map((prediction) => {
            const placeId = prediction.place_id;
            const description = prediction.description;
            const title = prediction.structured_formatting;

            return {
                place_id: placeId,
                description: description,
                structured_formatting: title,
            };
        });

        return datas;
    } catch (error) {
        console.error('Error fetching autocomplete places:', error.message);
        throw new Error('Failed to fetch autocomplete places');
    }
}


async function directional(pickup_lat, pickup_long, drop_lat, drop_long, stops = null) {
    try {
        const settings_directional = await Settings.findOne({ name: 'geoCoderApiKey' });

        if (!settings_directional) {
            throw new Error('API key not found');
        }

        const origin = `${pickup_lat},${pickup_long}`;
        const destination = `${drop_lat},${drop_long}`;

        let waypointsParam = '';
        if (stops) {
            const waypoints = JSON.parse(stops);
            waypointsParam = waypoints.map(waypoint => `${waypoint.way_lat},${waypoint.way_lng}`).join('|');
        }

        let url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${settings_directional.value}`;

        if (waypointsParam) {
            url += `&waypoints=${waypointsParam}`;
        }

        // Make the HTTP request to the Google Directions API
        const response = await axios.get(url);
        const result = response.data;

        if (result.routes && result.routes.length > 0) {
            const route = result.routes[0].overview_polyline.points;
            return { route };
        } else {
            throw new Error('No routes found');
        }
    } catch (error) {
        console.error('Error in directional function:', error);
        throw error;
    }
}



async function geocodeApi(address) {
    try {
        const settings_geocode = await Settings.findOne({ name: 'geoCoderApiKey' });

        if (!settings_geocode) {
            throw new Error('API key not found');
        }

        const apiKey = settings_geocode.value;
        const url = `https://maps.googleapis.com/maps/api/geocode/json`;

        // Make the HTTP request to the Google Geocoding API
        const response = await axios.get(url, {
            params: {
                address: address,
                key: apiKey,
            }
        });

        const data = response.data;

        if (data.status === 'OK' && data.results[0]) {
            const result = data.results[0];
            const latitude = result.geometry.location.lat;
            const longitude = result.geometry.location.lng;

            return {
                latitude: latitude,
                longitude: longitude
            };
        } else {
            // Handle geocoding errors
            return { error: 'Geocoding failed' };
        }
    } catch (error) {
        console.error('Error in geocodeApi function:', error);
        throw error;
    }
}


async function reverseGeocode(latitude) {
    try {
        const settings_geocode = await Settings.findOne({ name: 'geoCoderApiKey' });

        if (!settings_geocode) {
            throw new Error('API key not found');
        }

        const apiKey = settings_geocode.value;
        const url = `https://maps.googleapis.com/maps/api/geocode/json`;

        const response = await axios.get(url, {
            params: {
                latlng: latitude,
                key: apiKey,
            }
        });

        const data = response.data;

        if (data.status === 'OK' && data.results[0]) {
            const result = data.results[0];
            const address = result.formatted_address;
            return address;
        } else {
            return { error: 'Reverse geocoding failed' };
        }
    } catch (error) {
        console.error('Error in reverseGeocode function:', error);
        throw error;
    }
}


async function getZoneDetails(clientId) {
    try {
        const zoneDetails = await Zone.aggregate([
            {
                $match: { clientId: new ObjectId(clientId) }
            },
            {
                $lookup: {
                    from: 'countries',
                    localField: 'country',
                    foreignField: '_id',
                    as: 'countrydetails',
                },
            },
            {
                $unwind: '$countrydetails',
            },
            {
                $lookup: {
                    from: 'zoneprices',
                    localField: '_id',
                    foreignField: 'zoneId',
                    as: 'zonePriceDetails',
                },
            },
            {
                $lookup: {
                    from: 'zonesurgeprices',
                    localField: '_id',
                    foreignField: 'zoneId',
                    as: 'zoneSurgePriceDetails',
                },
            },
            {
                $lookup: {
                    from: 'vehicles',
                    localField: 'zonePriceDetails.vehicleId',
                    foreignField: '_id',
                    as: 'vehicleDetails',
                },
            },
            {
                $lookup: {
                    from: 'kits',
                    localField: 'zonePriceDetails.kitId',
                    foreignField: '_id',
                    as: 'kitDetails',
                }
            },
            {
                $lookup: {
                    from: 'Categorys',
                    localField: 'vehicleDetails.categoryId',
                    foreignField: '_id',
                    as: 'CategoryDetails',
                },
            },
            {
                $project: {
                    _id: 1,
                    zoneName: 1,
                    primaryZoneId: 1,
                    country: 1,
                    unit: 1,
                    adminCommissionType: 1,
                    adminCommission: 1,
                    mapZone: 1,
                    paymentTypes: 1,
                    nonServiceZone: 1,
                    zoneLevel: 1,
                    typesId: 1,
                    createdBy: 1,
                    clientId: 1,
                    status: 1,
                    'countrydetails.name': 1,
                    // 'countrydetails.currency_name': 1,
                    'countrydetails.currencyCode': 1,
                    'countrydetails.currencySymbol': 1,
                    'countrydetails.capital': 1,
                    zonePriceDetails: {
                        $map: {
                            input: '$zonePriceDetails',
                            as: 'priceDetail',
                            in: {
                                _id: '$$priceDetail._id',
                                zoneId: '$$priceDetail.zoneId',
                                vehicleId: '$$priceDetail.vehicleId',
                                kitId: '$$priceDetail.kitId',
                                ridenowBasePrice: { $toDouble: '$$priceDetail.ridenowBasePrice' },
                                ridenowPricePerTime: '$$priceDetail.ridenowPricePerTime',
                                ridenowBaseDistance: '$$priceDetail.ridenowBaseDistance',
                                ridenowPricePerDistance: { $toDouble: '$$priceDetail.ridenowPricePerDistance' },
                                ridenowFreeWaitingTime: '$$priceDetail.ridenowFreeWaitingTime',
                                ridenowFreeWaitingTimeAfterStart: '$$priceDetail.ridenowFreeWaitingTimeAfterStart',
                                ridenowWaitingCharge: { $toDouble: '$$priceDetail.ridenowWaitingCharge' },
                                ridenowCancellationFeeAfterAccept: { $toDouble: '$$priceDetail.ridenowCancellationFeeAfterAccept' },
                                ridenowCancellationFeeAfterArrive: { $toDouble: '$$priceDetail.ridenowCancellationFeeAfterArrive' },
                                ridenowCancellationFeeAfterStart: { $toDouble: '$$priceDetail.ridenowCancellationFeeAfterStart' },
                                ridenowAdminCommissionType: '$$priceDetail.ridenowAdminCommissionType',
                                ridenowAdminCommission: '$$priceDetail.ridenowAdminCommission',
                                ridelaterBasePrice: { $toDouble: '$$priceDetail.ridelaterBasePrice' },
                                ridelaterPricePerTime: '$$priceDetail.ridelaterPricePerTime',
                                ridelaterBaseDistance: '$$priceDetail.ridelaterBaseDistance',
                                ridelaterPricePerDistance: { $toDouble: '$$priceDetail.ridelaterPricePerDistance' },
                                ridelaterFreeWaitingTime: '$$priceDetail.ridelaterFreeWaitingTime',
                                ridelaterFreeWaitingTimeStart: '$$priceDetail.ridelaterFreeWaitingTimeStart',
                                ridelaterWaitingCharge: { $toDouble: '$$priceDetail.ridelaterWaitingCharge' },
                                ridelaterCancellationFeeAfterAccept: { $toDouble: '$$priceDetail.ridelaterCancellationFeeAfterAccept' },
                                ridelaterCancellationFeeAfterArrive: { $toDouble: '$$priceDetail.ridelaterCancellationFeeAfterArrive' },
                                ridelaterCancellationFeeAfterStart: { $toDouble: '$$priceDetail.ridelaterCancellationFeeAfterStart' },
                                ridelaterAdminCommissionType: '$$priceDetail.ridelaterAdminCommissionType',
                                ridelaterAdminCommission: '$$priceDetail.ridelaterAdminCommission',
                                status: '$$priceDetail.status',
                                createdBy: '$$priceDetail.createdBy',
                                createdAt: '$$priceDetail.createdAt',
                                updatedAt: '$$priceDetail.updatedAt',
                                vehicleDetails: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$vehicleDetails', // Array of all vehicles joined earlier
                                                as: 'vehicle',
                                                cond: { $eq: ['$$vehicle._id', '$$priceDetail.vehicleId'] }, // Match the vehicleId from price details
                                            },
                                        },
                                        0, // Pick the first element from the filtered results (which should be the matching vehicle)
                                    ],
                                },
                                kitDetails: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$kitDetails',
                                                as: 'kit',
                                                cond: { $eq: ['$$kit._id', '$$priceDetail.kitId'] }
                                            }
                                        },
                                        0
                                    ],
                                },
                            }
                        }
                    },
                    zoneSurgePriceDetails: {
                        $map: {
                            input: '$zoneSurgePriceDetails',
                            as: 'surgePriceDetail',
                            in: {
                                _id: '$$surgePriceDetail._id',
                                zoneId: '$$surgePriceDetail.zoneId',
                                vehicleId: '$$surgePriceDetail.vehicleId',
                                surgePrice: { $toDouble: '$$surgePriceDetail.surgePrice' },
                                surgeDistancePrice: { $toDouble: '$$surgePriceDetail.surgeDistancePrice' },
                                startTime: '$$surgePriceDetail.startTime',
                                endTime: '$$surgePriceDetail.endTime',
                                availableDays: '$$surgePriceDetail.availableDays',
                                status: '$$surgePriceDetail.status',
                                createdBy: '$$surgePriceDetail.createdBy',
                                createdAt: '$$surgePriceDetail.createdAt',
                                updatedAt: '$$surgePriceDetail.updatedAt',
                            }
                        }
                    }
                }
            }
        ]);

        return zoneDetails
    } catch (error) {

    }
}


async function getPickupZone(req) {
    try {

        let clientId = await getClientId(req);

        const { pick_lat, pick_lng } = req.body;

        const zones = await getZoneDetails(clientId);

        if (!zones || zones.length === 0) {
            return null;
        }

        const point = [pick_lng, pick_lat]; // User's coordinates in [lng, lat] format

        for (const zone of zones) {
            if (zone.mapZone && Array.isArray(zone.mapZone) && zone.mapZone.length > 0) {

                // Assuming the first polygon in the zone.mapZone array for now
                const polygon = zone.mapZone;

                // Check if the point is inside the polygon
                const isInside = isPointInPolygon(point, polygon);

                if (isInside) {
                    return zone; // Return the zone the user is inside
                }
            }
        }

        return null; // Return null if the point is not inside any zone
    } catch (error) {
        console.error('Error in getPrimaryZone function:', error);
        throw error;
    }
}
async function generateRequestNumber() {
    // Fetch the latest record from the Requests table
    const latestRequest = await Request.findOne({
        order: [['createdAt', 'DESC']], // Assuming `createdAt` is your timestamp column
    });

    let lastIndex = 0;

    if (latestRequest && latestRequest.requestNumber) {
        // Extract the number part after the underscore
        const requestNumberParts = latestRequest.requestNumber.split('_');
        lastIndex = parseInt(requestNumberParts[1], 10) || 0;
    }

    // Increment the index
    const index = lastIndex + 1;

    // Format the new request number
    return `KO_${String(index).padStart(5, '0')}`;
}
async function getDropZone(req) {
    try {

        let clientId = await getClientId(req);

        const { drop_lat, drop_long } = req.body;

        const zones = await getZoneDetails(clientId);


        if (!zones || zones.length === 0) {
            return null;
        }

        const point = [drop_long ? drop_long : req.body.droplng, drop_lat ? drop_lat : req.body.droplat]; // User's coordinates in [lng, lat] format

        for (const zone of zones) {
            if (zone.mapZone && Array.isArray(zone.mapZone) && zone.mapZone.length > 0) {

                // Assuming the first polygon in the zone.mapZone array for now
                const polygon = zone.mapZone;

                // Check if the point is inside the polygon
                const isInside = isPointInPolygon(point, polygon);

                if (isInside) {
                    return zone; // Return the zone the user is inside
                }
            }
        }

        return null; // Return null if the point is not inside any zone
    } catch (error) {
        console.error('Error in getPrimaryZone function:', error);
        throw error;
    }
}

const calculateDistance = async (pickup_lat, pickup_long, drop_lat, drop_long, stops) => {
    let distance = 0;

    // Ensure stops is parsed correctly
    let stopsParsed = [];
    if (Array.isArray(stops)) {
        stopsParsed = stops;
    } else if (typeof stops === 'string' && stops.trim()) {
        try {
            stopsParsed = JSON.parse(stops);
        } catch (error) {
            console.error("Invalid JSON for stops:", stops);
            throw new SyntaxError("Invalid JSON for stops");
        }
    }

    if (stopsParsed && stopsParsed.length > 0) {
        distance += await getDistance(pickup_lat, pickup_long, stopsParsed[0].latitude, stopsParsed[0].longitude);

        for (let i = 0; i < stopsParsed.length - 1; i++) {
            distance += await getDistance(stopsParsed[i].latitude, stopsParsed[i].longitude, stopsParsed[i + 1].latitude, stopsParsed[i + 1].longitude);
        }

        distance += await getDistance(stopsParsed[stopsParsed.length - 1].latitude, stopsParsed[stopsParsed.length - 1].longitude, drop_lat, drop_long);
    } else {
        distance = await getDistance(pickup_lat, pickup_long, drop_lat, drop_long);
    }

    return distance;
};



// Calculate distance using Google Distance Matrix API

const getDistance = async (pickup_lat, pickup_long, drop_lat, drop_long) => {
    const settings_geocode = await Settings.findOne({ name: 'geoCoderApiKey' });

    if (!settings_geocode) {
        throw new Error('API key not found');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickup_lat},${pickup_long}&destinations=${drop_lat},${drop_long}&mode=driving&language=en&key=${"AIzaSyD55md0K5igC3zEp0_FMhvQ2ZSL8QM2AjE"}`;

    try {
        const response = await axios.get(url);
        const distance = response.data.rows[0].elements[0].distance.value / 1000; // Distance in kilometers
        return distance;
    } catch (error) {
        console.error('Error fetching distance from Google API', error);
        return 0;
    }
};


const calculateZonePrices = async (req, zone, distance, ride_type, promo_code, user, ride_time, ride_date, drop_lat, drop_long) => {

    const zonePrice = [];

    if (zone && zone.zonePriceDetails) {

        for (let zonePriceItem of zone.zonePriceDetails) {

            if (!zonePriceItem.status) continue;

            const dropZone = await getDropZone(req);

            const outOfZoneFee = (!dropZone || dropZone.nonServiceZone === 'Yes') ? getOutOfZoneFee(distance) : 0;


            const totalValue = await etaCalculation(
                distance,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowBaseDistance : zonePriceItem.ridelaterBaseDistance,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowBasePrice : zonePriceItem.ridelaterBasePrice,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowPricePerDistance : zonePriceItem.ridelaterPricePerDistance,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowFreeWaitingTime : zonePriceItem.ridelaterFreeWaitingTime,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowWaitingCharge : zonePriceItem.ridelaterWaitingCharge,
                outOfZoneFee
            );

            let totalAmount = totalValue.sub_total;
            if (promo_code) {
                totalAmount = await applyPromoCode(req, totalAmount, user, zonePriceItem);
            }

            const zonePriceObj = {
                type_name: zonePriceItem.vehicleDetails.vehicleName || "",
                type_id: zonePriceItem.vehicleDetails._id || "",
                capacity: zonePriceItem.vehicleDetails.capacity || "",
                category: zonePriceItem.vehicleDetails.categoryId,
                type_image: "/uploads/vehicles/" + zonePriceItem.vehicleDetails.image,
                type_image_select: "/uploads/vehicles/" + zonePriceItem.vehicleDetails.highlightImage,
                base_price: totalValue.base_amount,
                base_distance: totalValue.base_distance,
                total_amount: totalAmount,
                distance,
                free_waiting_time: zonePriceItem.free_waiting_time,
                waiting_charge: totalValue.waiting_charge,
                price_per_time: zonePriceItem.price_per_time,
                computed_price: zonePriceItem.computed_price,
                computed_distance: zonePriceItem.computed_distance,
                price_per_distance: totalValue.price_per_distance,
                booking_base_fare: zonePriceItem.booking_base_fare,
                booking_base_per_kilometer: zonePriceItem.booking_base_per_kilometer,
                booking_fees: totalValue.booking_fee,
                out_of_zone_price: totalValue.outofzonefee,
            };

            // Add surge price if applicable
            zone.zoneSurgePriceDetails.forEach(surgePrice => {
                const isWithinTime = surgePrice.startTime <= ride_time && surgePrice.endTime >= ride_time;
                const isWithinDay = surgePrice.availableDays.includes(new Date(ride_date).getDay());
                if (isWithinTime && isWithinDay) {
                    totalAmount = surgePrice.surgeDistancePrice * distance + surgePrice.surgePrice + zonePriceObj.booking_fees;
                    zonePriceObj.total_amount = totalAmount;
                }
            });

            zonePrice.push(zonePriceObj);
        }
    }

    zonePrice.sort((a, b) => {
        const typeSlugA = a.type_slug || '';
        const typeSlugB = b.type_slug || '';
        return typeSlugA.localeCompare(typeSlugB);
    });


    return zonePrice;
};

const fetchDriver = async (pick_lat, pick_lng, vehicle_type, ride_type, drop_lat, drop_lng) => {
    const settingsPlaces = await Settings.findOne({ name: 'driverShowingKm' });
    const RADIUS_IN_KM = settingsPlaces.value;
    const METERS_PER_KM = 1000;
    let maxDistanceInMeters = RADIUS_IN_KM * METERS_PER_KM;
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

    try {
        const nearbyDrivers = await DriverLocation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [pick_lng, pick_lat],
                    },
                    $maxDistance: maxDistanceInMeters,
                },
            },
            lastUpdated: { $gte: thirtySecondsAgo },
            vehicleId: vehicle_type,
            serviceType: { $regex: new RegExp(`\\b${ride_type}\\b`, 'i') } // Ensures exact word match
        });

        return nearbyDrivers;
    } catch (error) {
        console.error("Error processing driver location:", error);
    }
};

const etaCalculation = async (distance, base_distance, base_price, price_per_distance, booking_base_fare, waiting_charge, outofzonefee) => {

    const base_amount = base_price;
    let distance_amount = 0;
    let balance_distance = 0;

    if (distance > base_distance) {
        balance_distance = distance - base_distance;
        distance_amount = balance_distance * price_per_distance;
    }

    const booking_fee = parseInt(booking_base_fare);

    const sub_total = base_amount + distance_amount + outofzonefee + booking_fee;

    return {
        base_amount: base_amount,
        base_distance: base_distance,
        price_per_distance: price_per_distance,
        distance_cost: distance_amount,
        booking_base_fare: 0,
        booking_km_amount: 0,
        booking_fee: booking_fee,
        outofzonefee: outofzonefee,
        sub_total: sub_total,
        waiting_charge: waiting_charge,
        balance_distance: balance_distance,
    };
};


// Apply promo code logic

const applyPromoCode = async (req, totalAmount, user) => {
    const { promo_code } = req.body;

    if (!promo_code) {
        return totalAmount;
    }

    const promo = await PromoCode.findOne({ _id: promo_code, status: true });

    if (!promo) {
        throw new Error('Invalid promo code');
    }

    if (promo.is_new_user && !user.is_new_user) {
        throw new Error('Promo code is only valid for new users');
    }

    if (promo.promoReuseCount && promo.totalCount >= promo.promoReuseCount) {
        throw new Error('Promo code usage limit has been reached');
    }


    const currentDate = new Date();
    if (currentDate < new Date(promo.fromDate) || currentDate > new Date(promo.toDate)) {
        throw new Error('Promo code is not valid at this time');
    }

    if (promo.promoType === 'percentage') {
        const discount = (totalAmount * promo.percentage) / 100;
        totalAmount -= discount;
    } else if (promo.promoType === 'fixed') {
        totalAmount -= promo.targetAmount;
    }

    if (totalAmount < 0) {
        totalAmount = 0;
    }

    promo.usage_count += 1;
    await promo.save();

    return totalAmount;
};

const getOutOfZoneFee = (distance) => {
    const outOfZoneRatePerKm = 10;
    const baseDistanceLimit = 10;
    if (distance <= baseDistanceLimit) {
        return 0;
    }

    const extraDistance = distance - baseDistanceLimit;
    const outOfZoneFee = extraDistance * outOfZoneRatePerKm;

    return outOfZoneFee;
};


function isPointInPolygon(point, polygon) {
    const x = point[0]; // Longitude (lng)
    const y = point[1]; // Latitude (lat)
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lng, yi = polygon[i].lat;
        const xj = polygon[j].lng, yj = polygon[j].lat;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

// Helper functions
const createDataResponse = (zone) => ({
    zone_name: zone.zoneName,
    country_name: zone.countrydetails.name,
    currency_symbol: zone.countrydetails.currency_symbol,
    payment_types: zone.paymentTypes,
    unit: zone.unit,
    country_id: zone.country,
});

const uniqueRandomNumbers = async (qnty) => {

    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    return randomNumber;

};


const sendError = (message, data, code) => ({
    success: false,
    message,
    data,
    code,
});


const fetchDrivers = async (lat, long, ride_type, trip_type) => {
    const settingsPlaces = await Settings.findOne({ name: 'driverShowingKm' });
    const RADIUS_IN_KM = settingsPlaces.value;
    const METERS_PER_KM = 1000;
    let maxDistanceInMeters = RADIUS_IN_KM * METERS_PER_KM;

    try {


        const nearbyDrivers = await DriverLocation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lat, long],
                    },
                    $maxDistance: maxDistanceInMeters,
                },
            },
        });
        for (const nDriver of nearbyDrivers) {

        }
        const topic = `user/getAllDrivers`;
        await publishMessage(topic, nearbyDrivers);
    } catch (error) {
        console.error("Error processing driver location:", error);
    }
};

const sendNotification = async (req, userIds, messageData) => {
    try {
        // Fetch users by IDs
        const users = await User.find({ _id: { $in: userIds } });
        const tokens = users
            .map(user => user.deviceInfoHash)
            .filter(deviceInfoHash => !!deviceInfoHash); // Ensure truthy values

        if (!tokens.length) {
            return { successCount: 0, failureCount: 0, responses: [] };
        }

        const message = {
            notification: {
                title: messageData.title,
                body: messageData.message,
                image: messageData.imageName, // Optional image URL
            },
            data: {
                title: messageData.title,
                body: messageData.message,
                image: messageData.imageName,
                type: "general", // Custom data type
            },
        };

        // Send notifications
        const responses = await Promise.allSettled(
            tokens.map(async token => {
                return admin.messaging().send({ ...message, token });
            })
        );

        // Analyze responses
        const successResponses = responses.filter(r => r.status === 'fulfilled');
        const failureResponses = responses.filter(r => r.status === 'rejected');


        return {
            successCount: successResponses.length,
            failureCount: failureResponses.length,
            responses: {
                success: successResponses.map(r => r.value),
                failure: failureResponses.map(r => r.reason),
            },
        };
    } catch (error) {
        console.error('Error sending notifications:', error.message);
        throw error; // Propagate error to the caller
    }
};

/**
 * Send Push Notification to a single device
 * @param {string} token - The device token
 * @param {string} title - The title of the notification
 * @param {string} message - The message of the notification
 */
const sendPushNotification = async (userId, messageData) => {
    try {

        console.log("sendNotification",userId);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Get the device token of the user
        const userToken = user.deviceInfoHash;  // Assuming the user's device token is stored in the `deviceToken` field

        console.log("sendNotificationuserToken",userToken);

        const message = {
            token: userToken,
            notification: {
                title: messageData.title,
                body: messageData.message,
                image: messageData.imageName || undefined, // Optional image URL
            },
            data: {
                title: String(messageData.title),
                body: String(messageData.message),
                image: messageData.imageName ? String(messageData.imageName) : "",
                type: "general", // Ensure this is a string
            },
        };


        try {
            const response = await admin.messaging().send(message);

            const notification = new Notification({
                title: messageData.title,
                userId: userId,
                subTitle: messageData.subTitle || null,
                message: messageData.message,
                image: messageData.imageName || null,
                status: response ? 1 : 0, // 1 = success, 0 = failure
                notificationType: messageData.notificationType || 'GENERAL',
                clientId: messageData.clientId || null,
            });

            await notification.save();

            return response;
        } catch (error) {
            return null;
        }
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
};

const endCalculateZonePrices = async (req, zone, distance, ride_type, promo_code, user, ride_time, ride_date, beforewaitingtime, afterwaitingtime) => {

    const zonePrice = [];

    if (zone && zone.zonePriceDetails) {

        for (let zonePriceItem of zone.zonePriceDetails) {

            if (!zonePriceItem.status) continue;

            const dropZone = await getDropZone(req);

            const outOfZoneFee = (!dropZone || dropZone.nonServiceZone === 'Yes') ? getOutOfZoneFee(distance) : 0;

            const totalValue = await endEtaCalculation(
                distance,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowBaseDistance : zonePriceItem.ridelaterBaseDistance,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowBasePrice : zonePriceItem.ridelaterBasePrice,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowPricePerDistance : zonePriceItem.ridelaterPricePerDistance,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowFreeWaitingTime : zonePriceItem.ridelaterFreeWaitingTime,
                ride_type === 'RIDE_NOW' ? zonePriceItem.ridenowWaitingCharge : zonePriceItem.ridelaterWaitingCharge,
                outOfZoneFee,
                beforewaitingtime,
                afterwaitingtime
            );

            let totalAmount = totalValue.sub_total;
            if (promo_code) {
                totalAmount = await applyPromoCode(req, totalAmount, user, zonePriceItem);
            }

            const zonePriceObj = {
                type_name: zonePriceItem.vehicleDetails.vehicleName || "",
                type_id: zonePriceItem.vehicleDetails._id || "",
                capacity: zonePriceItem.vehicleDetails.capacity || "",
                category: zonePriceItem.vehicleDetails.categoryId,
                type_image: "/uploads/vehicles/" + zonePriceItem.vehicleDetails.image,
                type_image_select: "/uploads/vehicles/" + zonePriceItem.vehicleDetails.highlightImage,
                base_price: totalValue.base_amount,
                base_distance: totalValue.base_distance,
                total_amount: totalAmount,
                distance,
                free_waiting_time: zonePriceItem.free_waiting_time,
                waiting_charge: totalValue.waiting_charge,
                price_per_time: zonePriceItem.price_per_time,
                computed_price: zonePriceItem.computed_price,
                computed_distance: zonePriceItem.computed_distance,
                price_per_distance: totalValue.price_per_distance,
                booking_base_fare: zonePriceItem.booking_base_fare,
                booking_base_per_kilometer: zonePriceItem.booking_base_per_kilometer,
                booking_fees: totalValue.booking_fee,
                out_of_zone_price: totalValue.outofzonefee,
            };

            // Add surge price if applicable
            zone.zoneSurgePriceDetails.forEach(surgePrice => {
                const isWithinTime = surgePrice.startTime <= ride_time && surgePrice.endTime >= ride_time;
                const isWithinDay = surgePrice.availableDays.includes(new Date(ride_date).getDay());
                if (isWithinTime && isWithinDay) {
                    totalAmount = surgePrice.surgeDistancePrice * distance + surgePrice.surgePrice + zonePriceObj.booking_fees;
                    zonePriceObj.total_amount = totalAmount;
                }
            });

            zonePrice.push(zonePriceObj);
        }
    }

    // Sort zone prices by sorting order
    zonePrice.sort((a, b) => {
        const typeSlugA = a.type_slug || ''; // Use empty string as fallback if type_slug is undefined
        const typeSlugB = b.type_slug || '';
        return typeSlugA.localeCompare(typeSlugB);
    });


    return zonePrice;
};

const endEtaCalculation = async (distance, base_distance, base_price, price_per_distance, waiting_free_time, waiting_charge, outofzonefee, beforewaitingtime, afterwaitingtime) => {

    const base_amount = base_price;
    let distance_amount = 0;
    let balance_distance = 0;

    let totalWaitingMin = 0;
    let WaitingTimePrice = 0;

    if (distance > base_distance) {
        balance_distance = distance - base_distance;
        distance_amount = balance_distance * price_per_distance;
    }

    if (waiting_free_time < beforewaitingtime) {
        totalWaitingMin = totalWaitingMin + beforewaitingtime - waiting_free_time
    }

    if (waiting_free_time < afterwaitingtime) {
        totalWaitingMin = totalWaitingMin + afterwaitingtime - waiting_free_time
    }

    if (totalWaitingMin != 0) {
        WaitingTimePrice = waiting_charge * totalWaitingMin
    }

    const sub_total = base_amount + distance_amount + outofzonefee + WaitingTimePrice;

    return {
        base_amount: base_amount,
        base_distance: base_distance,
        price_per_distance: price_per_distance,
        distance_cost: distance_amount,
        booking_base_fare: 0,
        booking_km_amount: 0,
        outofzonefee: outofzonefee,
        sub_total: sub_total,
        waiting_charge: WaitingTimePrice,
        balance_distance: balance_distance,
    };
};

const walletTransaction = async (amount, userId, type, purpose, requestId) => {
    let wallet;
    if (type == 'Spent') {
        wallet = await Wallet.findOne({ userId: userId });

        if (wallet) {
            wallet.amountSpent = amount ? amount : 0;
            wallet.balance -= amount ? amount : 0;
            wallet.save();
        }
        else {
            const walletParams = {
                userId: userId,
                earnedAmount: 0,
                amountSpent: amount ? amount : 0,
                balance: amount ? amount : 0,
            };

            wallet = await Wallet.create(walletParams);
        }

        await WalletTransaction.create({
            walletId: wallet.id,
            amount: amount ? 0 - amount : 0,
            purpose: purpose,
            requestId: requestId,
            type: type,
            userId: userId
        });
    }
    else if (type == 'Earned') {
        wallet = await Wallet.findOne({ userId: userId });

        if (wallet) {
            wallet.earnedAmount += amount ? amount : 0;
            wallet.balance += amount ? amount : 0;
            wallet.save();
        }
        else {
            const walletParams = {
                userId: userId,
                earnedAmount: amount ? amount : 0,
                amountSpent: 0,
                balance: amount ? amount : 0,
            };

            wallet = await Wallet.create(walletParams);
        }

        await WalletTransaction.create({
            walletId: wallet.id,
            amount: amount ? amount : 0,
            purpose: purpose,
            requestId: requestId,
            type: type,
            userId: userId
        });
    }
};

const walletIntialTransaction = async (amount, userId, type, purpose) => {
    let wallet;
    if (type == 'Spent') {
        wallet = await Wallet.findOne({ userId: userId });

        if (wallet) {
            wallet.amountSpent = amount ? amount : 0;
            wallet.balance -= amount ? amount : 0;
            wallet.save();
        }
        else {
            const walletParams = {
                userId: userId,
                earnedAmount: 0,
                amountSpent: amount ? amount : 0,
                balance: amount ? amount : 0,
            };

            wallet = await Wallet.create(walletParams);
        }

        await WalletTransaction.create({
            walletId: wallet.id,
            amount: amount ? 0 - amount : 0,
            purpose: purpose,
            type: type,
            userId: userId
        });
    }
    else if (type == 'Earned') {
        wallet = await Wallet.findOne({ userId: userId });

        if (wallet) {
            wallet.earnedAmount += amount ? amount : 0;
            wallet.balance += amount ? amount : 0;
            wallet.save();
        }
        else {
            const walletParams = {
                userId: userId,
                earnedAmount: amount ? amount : 0,
                amountSpent: 0,
                balance: amount ? amount : 0,
            };

            wallet = await Wallet.create(walletParams);
        }

        await WalletTransaction.create({
            walletId: wallet.id,
            amount: amount ? amount : 0,
            purpose: purpose,
            type: type,
            userId: userId
        });
    }
};


async function endPickUpPickupZone(req) {
    try {

        let clientId = await getClientId(req);


        const { picklat, picklng } = req.body;

        const zones = await getZoneDetails(clientId);

        if (!zones || zones.length === 0) {
            return null;
        }

        const point = [picklng, picklat]; // User's coordinates in [lng, lat] format


        for (const zone of zones) {
            if (zone.mapZone && Array.isArray(zone.mapZone) && zone.mapZone.length > 0) {

                // Assuming the first polygon in the zone.mapZone array for now
                const polygon = zone.mapZone;

                // Check if the point is inside the polygon
                const isInside = isPointInPolygon(point, polygon);

                if (isInside) {
                    return zone; // Return the zone the user is inside
                }
            }
        }

        return null; // Return null if the point is not inside any zone
    } catch (error) {
        console.error('Error in getPrimaryZone function:', error);
        throw error;
    }
}

const fetchKit = async (pick_lat, pick_lng, kit_type, ride_type, drop_lat, drop_lng) => {
    const settingsPlaces = await Settings.findOne({ name: 'driverShowingKm' });
    const RADIUS_IN_KM = settingsPlaces.value;
    const METERS_PER_KM = 1000;
    let maxDistanceInMeters = RADIUS_IN_KM * METERS_PER_KM;
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);

    try {
        const nearbyDrivers = await DriverLocation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [pick_lng, pick_lat],
                    },
                    $maxDistance: maxDistanceInMeters,
                },
            },
            lastUpdated: { $gte: thirtySecondsAgo },
            kitId: { $in: [new ObjectId(kit_type)] },
            serviceType: { $regex: new RegExp(`\\b${ride_type}\\b`, 'i') } // Ensures exact word match
        });

        return nearbyDrivers;
    } catch (error) {
        console.error("Error processing driver location:", error);
    }
};

async function getStopPointZone(req) {
    try {

        let clientId = await getClientId(req);

        const { stop_lat, stop_lng } = req.body;

        const zones = await getZoneDetails(clientId);


        if (!zones || zones.length === 0) {
            return null;
        }

        const point = [stop_lng, stop_lat]; // User's coordinates in [lng, lat] format

        for (const zone of zones) {
            if (zone.mapZone && Array.isArray(zone.mapZone) && zone.mapZone.length > 0) {

                // Assuming the first polygon in the zone.mapZone array for now
                const polygon = zone.mapZone;

                // Check if the point is inside the polygon
                const isInside = isPointInPolygon(point, polygon);

                if (isInside) {
                    return zone; // Return the zone the user is inside
                }
            }
        }

        return null; // Return null if the point is not inside any zone
    } catch (error) {
        console.error('Error in getPrimaryZone function:', error);
        throw error;
    }
}


module.exports = { autocompletePlaces, directional, geocodeApi, reverseGeocode, getPickupZone, getDropZone, calculateDistance, etaCalculation, applyPromoCode, getOutOfZoneFee, calculateZonePrices, createDataResponse, generateRequestNumber, uniqueRandomNumbers, sendNotification, isPointInPolygon, fetchDriver, sendPushNotification, endCalculateZonePrices, walletTransaction, endPickUpPickupZone, getStopPointZone, fetchKit,walletIntialTransaction };
