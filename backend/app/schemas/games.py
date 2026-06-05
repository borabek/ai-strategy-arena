from pydantic import BaseModel, ConfigDict

class GameOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    title: str
    description: str
