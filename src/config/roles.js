const allRoles = {
  user: ['getUsers', 'manageUsers', 'Role', 'Permissions', 'Privillege', 'Users', 'Language', 'Country', 'Version', 'Setting', 'Translation', 'Vehicle', 'VehicleModels', 'Category', 'GroupDocument', 'Document', 'Admin', 'Company', 'Driver', 'Dispatcher', 'SubScription', 'Client', 'Intro', 'Zone', 'ZonePrice', 'ZoneSurgePrice', 'DriverDocument', 'PromoCode', 'Request', 'CancellationReason', 'MobileUser', 'Sos', 'Complaint', 'Wallet', 'OutOfZone', 'InvoiceQuestions', 'SendNotifications', 'Referral', 'CompanySubScription', 'Faq', 'UserComplaint', 'Rental', 'Rating', 'Favourite','Goods'],
  admin: ['getUsers', 'manageUsers', 'Role', 'Permissions', 'Privillege', 'Users', 'Language', 'Country', 'Version', 'Setting', 'Translation', 'Vehicle', 'VehicleModels', 'Category', 'GroupDocument', 'Document', 'Admin', 'Company', 'Driver', 'Dispatcher', 'SubScription', 'Client', 'Intro', 'Zone', 'ZonePrice', 'ZoneSurgePrice', 'DriverDocument', 'PromoCode', 'Request', 'CancellationReason', 'MobileUser', 'Sos', 'Complaint', 'Wallet', 'OutOfZone', 'InvoiceQuestions', 'SendNotifications', 'Referral', 'CompanySubScription', 'Faq', 'UserComplaint', 'Rental', 'Rating', 'Favourite','Goods'],
  client: ['getUsers', 'manageUsers', 'Role', 'Permissions', 'Privillege', 'Users', 'Language', 'Country', 'Version', 'Setting', 'Translation', 'Vehicle', 'VehicleModels', 'Category', 'GroupDocument', 'Document', 'Admin', 'Company', 'Driver', 'Dispatcher', 'SubScription', 'Client', 'Intro', 'Zone', 'ZonePrice', 'ZoneSurgePrice', 'DriverDocument', 'PromoCode', 'Request', 'CancellationReason', 'MobileUser', 'Sos', 'Complaint', 'Wallet', 'OutOfZone', 'InvoiceQuestions', 'SendNotifications', 'Referral', 'CompanySubScription', 'Faq', 'UserComplaint', 'Rental', 'Rating', 'Favourite','Goods'],
  driver: ['getUsers', 'manageUsers', 'Role', 'Permissions', 'Privillege', 'Users', 'Language', 'Country', 'Version', 'Setting', 'Translation', 'Vehicle', 'VehicleModels', 'Category', 'GroupDocument', 'Document', 'Admin', 'Company', 'Driver', 'Dispatcher', 'SubScription', 'Client', 'Intro', 'Zone', 'ZonePrice', 'ZoneSurgePrice', 'DriverDocument', 'PromoCode', 'Request', 'CancellationReason', 'MobileUser', 'Sos', 'Complaint', 'Wallet', 'OutOfZone', 'InvoiceQuestions', 'SendNotifications', 'Referral', 'CompanySubScription', 'Faq', 'UserComplaint', 'Rental', 'Rating', 'Favourite','Goods'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights
};
