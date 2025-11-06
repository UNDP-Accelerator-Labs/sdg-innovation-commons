from .locations import tree as locations_tree
from .sdgs import tree as sdg_tree
from .tags import tree as tag_tree
from .years import tree as year_tree
from .solutions import tree as solutions_tree
from .elements import tree as elements_tree
from .stories import tree as stories_tree
from .experiments import tree as experiments_tree
from .blogs import tree as blogs_tree

registries = [
  locations_tree,
  sdg_tree,
  tag_tree,
  year_tree,
  solutions_tree,
  elements_tree,
  stories_tree,
  experiments_tree,
  blogs_tree,
]

__all__ = [
  'registries',
]