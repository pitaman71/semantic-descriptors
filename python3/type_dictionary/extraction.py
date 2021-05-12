#!/usr/bin/env python3

from __future__ import annotations
import inspect
import abc
import enum
import typing
import datetime

from elevated_objects import serializable

from . import representation

class Reference(serializable.Visitor):
    factory: serializable.Factory
    dictionary: representation.Dictionary
    shape: typing.Union[representation.Shape, None]

    def __init__(self, factory: serializable.Factory, dictionary: representation.Dictionary):
        self.factory = factory
        self.dictionary = dictionary
        self.shape = None

    def begin(self, obj, parent_prop_name: str=None) -> None:
        self.shape = self.dictionary.reference_class(self.factory, obj.__class__)

    def end(self, obj) -> None:
        self.shape = None

    def verbatim(self, data_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        pass

    def primitive(self, data_type: typing.Type, target: serializable.Serializable, propName: str, fromString: typing.Callable[ [str], serializable.PropType ] = None) -> None:
        pass

    def scalar(self, element_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        pass

    def array(self, element_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        pass

    def map(self, key_type: typing.Type, element_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        pass

class Definition(serializable.Visitor):
    factory: serializable.Factory
    dictionary: representation.Dictionary
    shape: representation.Shape

    def __init__(self, factory: serializable.Factory, dictionary: representation.Dictionary, shape: representation.Shape):
        self.factory = factory
        self.dictionary = dictionary
        self.shape = shape

    def begin(self, obj, parent_prop_name: str=None) -> None:
        pass

    def end(self, obj) -> None:
        pass

    def verbatim(self, data_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        if self.is_deep:
            self.shape.property_order.append(propName)
            sub = representation.Verbatim()
            sub.name = propName
            sub.parent = self.shape
            sub.element_type = self.dictionary.reference_native(self.factory, data_type)
            self.shape.property_shape[propName] = sub

    def primitive(self, data_type: typing.Type, target: serializable.Serializable, propName: str, fromString: typing.Callable[ [str], serializable.PropType ] = None) -> None:
        if self.is_deep:
            self.shape.property_order.append(propName)
            sub = representation.Primitive()
            sub.name = propName
            sub.parent = self.shape
            sub.element_type = self.dictionary.reference_native(self.factory, data_type)
            self.shape.property_shape[propName] = sub

    def scalar(self, element_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        if self.is_deep:
            self.shape.property_order.append(propName)
            sub = representation.Scalar()
            sub.name = propName
            sub.parent = self.shape
            sub.element_type = self.dictionary.reference_class(self.factory, element_type)
            self.shape.property_shape[propName] = sub

    def array(self, element_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        if self.is_deep:
            self.shape.property_order.append(propName)
            sub = representation.Array()
            sub.name = propName
            sub.parent = self.shape
            sub.element_type = self.dictionary.reference_class(self.factory, element_type)
            self.shape.property_shape[propName] = sub

    def map(self, key_type: typing.Type, element_type: typing.Type, target: serializable.Serializable, propName: str) -> None:
        if self.is_deep:
            self.shape.property_order.append(propName)
            sub = representation.Array()
            sub.name = propName
            sub.parent = self.shape
            sub.key_type = self.dictionary.reference_native(self.factory, key_type)
            sub.element_type = self.dictionary.reference_class(self.factory, element_type)
            self.shape.property_shape[propName] = sub
