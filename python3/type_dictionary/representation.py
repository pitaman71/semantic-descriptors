#!/usr/bin/env python3

from __future__ import annotations
import inspect
import abc
import enum
import typing
import datetime

from elevated_objects import serializable, construction

from . import extraction

PropType = typing.TypeVar('PropType')
__module__ = 'omniglot.type_signature'

class NativeTypes(enum.Enum):
    Unknown = None
    String = 'string'
    Integer = 'integer'
    Float = 'float'
    DateTime = 'datetime'
    Json = 'json'

class Shape(serializable.Serializable):
    pass

class Property(serializable.Serializable):
    name: str

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.primitive(str, self, 'name')
        visitor.end(self)

class Verbatim(Property):
    data_type: NativeTypes

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.primitive(NativeTypes, self, 'data_type')
        visitor.end(self)

class Primitive(Property):
    data_type: NativeTypes

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.primitive(NativeTypes, self, 'data_type')
        visitor.end(self)

class Scalar(Property):
    element_type: Shape

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.scalar(Shape, self, 'element_type')
        visitor.end(self)

class Array(Property):
    element_type: Shape

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.scalar(Shape, self, 'element_type')
        visitor.end(self)

class Map(Property):
    key_type: NativeTypes
    element_type: Shape

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.primitive(NativeTypes, self, 'key_type')
        visitor.scalar(Shape, self, 'element_type')
        visitor.end(self)

class Class(Shape):
    property_order: typing.List[str]
    property_shape: typing.Dict[str, Shape]

    def __init__(self):
        super().__init__()
        self.property_order = []
        self.property_shape = {}

    def marshal(self, visitor: serializable.Visitor) -> None:
        visitor.begin(self)
        super().marshal(visitor)
        visitor.primitive(str, self, 'property_order')
        visitor.primitive(Shape, self, 'property_shape')
        visitor.end(self)

class Dictionary(serializable.Serializable):
    class_id_to_definition: typing.Dict[int, extraction.Definition]
    arrays: typing.List[Array]
    maps: typing.List[Map]

    def reference_class(self, factory: construction.Factory, cls) -> extraction.Definition:
        if id(cls) not in self.class_id_to_shape:
            shape = Class()
            def_extractor = extraction.Definition(factory, self, Class())
            shape.marshal(def_extractor)
            self.class_id_to_definition[id(cls)] = def_extractor
        return self.class_id_to_definition[id(cls)]

    def reference_native(self, factory: construction.Factory, data_type: typing.Type) -> NativeTypes:
        if data_type == int:
            return NativeTypes.Integer
        elif data_type == float:
            return NativeTypes.Float
        elif data_type == str:
            return NativeTypes.String
        elif data_type == datetime.datetime:
            return NativeTypes.DateTime
        elif type(data_type) in (dict, list, tuple):
            return NativeTypes.Json
        raise RuntimeError(f"Cannot codify native type {data_type}, int, float, str, datetime, dict, list, tuple are supported in Python")
