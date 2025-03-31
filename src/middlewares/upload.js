const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');



// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/categoryImage/')); // Set upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`); // Save file with unique name
  }
});


// Configure storage for multer
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/user/')); // Set upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`); // Save file with unique name
  }
});

// Configure storage for multer
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/intro/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Configure storage for multer
const vehiclestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/vehicles/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const vehicleModelstorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/vehicleModels/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename); // Save file with unique name
  }
});


const driverdocumentModelstorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/documentImage/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename); // Save file with unique name
  }
});


const settingstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/setting/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});


const promoModelstorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/promo/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename); // Save file with unique name
  }
});


const dispatcherModelstorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/dispatcher/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename); // Save file with unique name
  }
});

const pushNotificationstorage = multer.diskStorage({

  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads/pushnotification/'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null, filename); // Save file with unique name
  }
});

const goodsModelStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,path.join(__dirname,"../../uploads/goods/"));
  },
  filename: (req,file,cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null,filename);
  }
});

const 
requestModelStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,path.join(__dirname,"../../uploads/requestImage/"));
  },
  filename: (req,file,cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null,filename);
  }
});



const requestKitStorage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,path.join(__dirname,"../../uploads/kitImage/"));
  },
  filename: (req,file,cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    const filename = `${uniqueSuffix}${ext}`;
    cb(null,filename);
  }
});

const upload = multer({ storage });

const userUpload = multer({ storage : userStorage });

const vehicleUpload = multer({ storage : vehiclestorage});

const vehicleModelUpload = multer({ storage : vehicleModelstorage });

const imageModelUpload = multer({ storage : imageStorage });

const documentModelUpload = multer({ storage : driverdocumentModelstorage });

const settingUpload = multer({ storage : settingstorage});

const promoUpload = multer({ storage : promoModelstorage});

const dispatcherUpload = multer({ storage : dispatcherModelstorage});


const pushNotificationUpload = multer({ storage : pushNotificationstorage});

const goodsUpload = multer({ storage : goodsModelStorage});

const requestUpload = multer({ storage: requestModelStorage});

const kitUpload = multer({ storage: requestKitStorage});


module.exports = {upload,userUpload,vehicleUpload,vehicleModelUpload,imageModelUpload,documentModelUpload,settingUpload,promoUpload,dispatcherUpload,pushNotificationUpload,goodsUpload,requestUpload,kitUpload};
