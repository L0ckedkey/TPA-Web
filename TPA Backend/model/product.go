package model

type Product struct {
	ID                         int                      `json: "id"`
	ProductName                string                   `json: "name"`
	ProductPrice               int                      `json: "price"`
	Stock                      int                      `json: "stock"`
	Brand                      Brand                    `json: "brand"`
	BrandID                    int                      `json: "brand_id"`
	ProductCategoryID          int                      `json: "product_category_id"`
	ProductSubCategoryID       int                      `json: "product_sub_category_id"`
	ProductSubCategoryDetailID int                      `json: "product_sub_category_detail_id"`
	ShopID                     int                      `json: "shop_id"`
	Description                string                   `json: "description"`
	ProductCategory            ProductCategory          `json: "product_category"`
	Shop                       Shop                     `json: "shop"`
	ProductSubCategory         ProductSubCategory       `json: "product_sub_category"`
	ProductSubCategoryDetail   ProductSubCategoryDetail `json: "product_sub_category_detail"`
	Url                        string
	Sold                       int
	Rating                     int
	Reviewed                   int
	Point                      int
}

type Brand struct {
	ID   int    `json: "id" pg: "pk,bigserial"`
	Name string `json: "name`
	Sold int
}

type ProductCategory struct {
	ID           int    `json: "id" pg: "pk,bigserial"`
	CategoryName string `json: "category_name"`
	Sold         int
}

type Shop struct {
	ID                  int     `json: "id" pg: "pk,bigserial"`
	Name                string  `json: "name"`
	Status              string  `json: "status"`
	DeliveryStatistic   float64 `json: "delivery_statistic" pg:",notnull"`
	ProductAccuracy     float64 `json: "product_accuracy" pg:",notnull"`
	ServiceSatisfaction float64 `json: "service_satisfaction" pg:",notnull"`
	NumberOfSales       int     `json: "number_of_sales" pg:",notnull"`
	Description         string  `json: "description"`
	Email               string  `json: "email"`
	Sold                int
	RatingShop          float64
	RatingQuestion1     float64
	RatingQuestion2     float64
	RatingQuestion3     float64
	Reviewed            int
	PointQuestion1      int
	PointQuestion2      int
	PointQuestion3      int
	PointShop           int
}

type ProductSubCategory struct {
	ID                int    `json: "id" pg: "pk,bigserial"`
	Name              string `json: "name"`
	ProductCategoryID string `json: "product_category_id"`
}

// `sql:"product_category_id,type:text REFERENCES product_categories(product_category_id) ON DELETE CASCADE"`

type ProductSubCategoryDetail struct {
	ID                         int    `json: "id" pg: "pk,bigserial"`
	ProductSubCategoryDetailID string `json: "product_sub_category_detail_id"`
	Name                       string `json: "name"`
}

type Cart struct {
	AccountID int     `json: "account_id"`
	Quantity  int     `json: "quantity"`
	ID        int     `json: "id"`
	ProductID int     `json: "product_id"`
	ShopID    int     `json: "shop"`
	Product   Product `json: "product"`
	Account   Account `json: "account"`
	Shop      Shop    `json: "shop"`
}
