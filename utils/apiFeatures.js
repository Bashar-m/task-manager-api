class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; // Mongoose query object (Model.find())
    this.queryStr = queryStr; // req.query القادم من المستخدم
    this.filterObject = {}; // لحفظ فلاتر البحث المتقدمة
    this.pagination = {}; // لحفظ معلومات  (pagination)
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // gta gt lt lte g
    const filterObject = {};
    for (const key in queryObj) {
      if (key.includes("[")) {
        const [field, operator] = key.split(/\[|\]/).filter(Boolean);
        if (!filterObject[field]) filterObject[field] = {};
        filterObject[field][`$${operator}`] = queryObj[key];
      } else {
        filterObject[key] = queryObj[key];
      }
    }

    this.filterObject = filterObject;
    this.query = this.query.find(this.filterObject);
    return this;
  }

  search() {
    if (this.queryStr.keyword) {
      let keyword = this.queryStr.keyword;
      if (Array.isArray(keyword)) keyword = keyword.join("|");

      const regexQuery = {
        $or: [
          { title: new RegExp(keyword, "i") },
          { description: new RegExp(keyword, "i") },
        ],
      };

      this.query = this.query.find({
        $and: [this.filterObject, regexQuery],
      });
    }

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // تحديد الحقول
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  //paginate
  paginate(totalDocuments) {
    const page = parseInt(this.queryStr.page, 10) || 1;
    const limit = parseInt(this.queryStr.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const totalPages = Math.ceil(totalDocuments / limit);

    this.pagination = {
      currentPage: page,
      limit,
      skip,
      totalDocuments,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  // تنفيذ الاستعلام
  async execute() {
    const results = await this.query;
    return {
      results,
      pagination: this.pagination,
    };
  }
}

module.exports = ApiFeatures;
