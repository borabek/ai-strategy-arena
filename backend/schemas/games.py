from pydantic import BaseModel

class GameOut(BaseModel):
    id: int
    slug: str
    title: str
    description: str

    class Config:
        from_attributes = True
