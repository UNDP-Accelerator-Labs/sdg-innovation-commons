from .locations import tree as locations_tree
from .sdgs import tree as sdg_tree
from .tags import tree as tag_tree
from .years import tree as year_tree
from .solutions import tree as solutions_tree
"""
TO DO: Import stories, elements, learningplans, etc.
And add to registries list below.
"""

registries = [
  locations_tree,
  sdg_tree,
  tag_tree,
  year_tree,
  solutions_tree,
]

__all__ = [
  'registries',
]