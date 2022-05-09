const tableName = "car_list";
const columns = [
    'id',
    'ad_id',
    'link',
    'brand_id',
    'type_id',
    'title',
    'description',
    'image_url',
    'price',
    'extra_data',
    'distance',
    'user_deactivated',
    'highlighted',
    'created_at',
    'updated_at',
]

module.exports = {
    tableName,
    columns,
}
