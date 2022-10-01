export default class ApiFutures {
  query: any;
  queryString: any;
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });

    return this;
  }
  filter() {
    const queryCopy = { ...this.queryString };

    const removeFields = ["keywords", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryString = JSON.stringify(queryCopy);

    queryString = queryString.replace(
      /\b(t|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  pagination(resultPerPage: number) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
