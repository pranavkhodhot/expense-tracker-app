from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    category_name: str

class CategoryCreate(CategoryBase):
     pass

class CategoryOut(CategoryBase):
    category_id: int
    
    model_config = ConfigDict(from_attributes=True)