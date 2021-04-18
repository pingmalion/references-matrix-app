// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  Button,
  DropdownList,
  DropdownListItem,
  EntityList,
  EntityListItem,
  FieldGroup,
} from "@contentful/forma-36-react-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface FieldProps {
  sdk: FieldExtensionSDK;
}

const Field = (props: FieldProps) => {
  const fieldValue = props.sdk.field.getValue();
  const locale = props.sdk.field.locale;

  const [values, setValues] = useState(fieldValue || []);

  const [isLoading, setIsLoading] = useState(true);
  const [references, setReferences] = useState(null);
  const [titles, setTitles] = useState(null);
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    props.sdk.window.startAutoResizer();
  });

  useEffect(() => {
    const { contentTypesIds, titleFieldIds } = props.sdk.parameters
      .instance as any;
    setReferences(contentTypesIds.split(/\s*,\s*/g).filter(Boolean));
    setTitles(titleFieldIds.split(/\s*,\s*/g).filter(Boolean));
  }, [props.sdk.parameters.instance]);

  useEffect(() => {
    const getSysEntries = async () => {
      const sysEntries = await props.sdk.space.getEntries({
        "sys.contentType.sys.id[in]": references,
      });

      const es = sysEntries.items.reduce((acc, i) => {
        const idx = references.indexOf(i.sys.contentType.sys.id);

        return {
          ...acc,
          [i.sys.id]: i.fields[titles[idx]],
        };
      }, {});

      setIsLoading(false);
      setEntries(es);
    };

    if (references && titles) {
      getSysEntries();
    }
  }, [props.sdk.space, references, titles]);

  useEffect(() => {
    props.sdk.field.setValue(values);
  }, [values, props.sdk.field]);

  const onAddValue = () => {
    setValues([
      ...values,
      references.reduce((acc, r) => ({ ...acc, [r]: "" }), {}),
    ]);
  };

  const onRemoveValue = (idx) => {
    setValues((prevValues) => {
      const result = Array.from(prevValues);
      result.splice(idx, 1);
      return result;
    });
  };

  const onSelect = async (key, idx) => {
    const selectedEntry = await props.sdk.dialogs.selectSingleEntry({
      locale,
      contentTypes: [key],
    });

    if (selectedEntry) {
      setValues((prevValues) => {
        const result = Array.from(prevValues);
        result[idx][key] = selectedEntry.sys.id;
        return result;
      });
    }
  };

  const onDragEnd = (e) => {
    if (!e.destination) {
      return;
    }

    const { source, destination } = e;

    setValues((prevValues) => {
      const result = Array.from(prevValues);
      const [removed] = result.splice(source.index, 1);
      result.splice(destination.index, 0, removed);
      return result;
    });
  };

  return (
    <FieldGroup>
      <EntityList>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="rows">
            {(provided) => {
              return (
                <div ref={provided.innerRef} className="rows">
                  {values.map((value, idx) => {
                    return (
                      <Draggable
                        key={`${idx}`}
                        draggableId={`${idx}`}
                        index={idx}
                      >
                        {(provided) => {
                          return (
                            <div
                              key={idx}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={{
                                userSelect: "none",
                                ...provided.draggableProps.style,
                              }}
                            >
                              <EntityListItem
                                title={
                                  entries
                                    ? references.map((key, i) => (
                                        <Button
                                          buttonType="muted"
                                          icon="Link"
                                          key={i}
                                          onClick={() => onSelect(key, idx)}
                                          size="small"
                                          style={{ margin: "0 5px" }}
                                          type="button"
                                        >
                                          {entries[value[key]]?.[locale] ||
                                            value[key] ||
                                            key}
                                        </Button>
                                      ))
                                    : ""
                                }
                                dropdownListElements={
                                  <DropdownList>
                                    <DropdownListItem isTitle>
                                      Actions
                                    </DropdownListItem>
                                    <DropdownListItem
                                      onClick={() => onRemoveValue(idx)}
                                    >
                                      Remove
                                    </DropdownListItem>
                                  </DropdownList>
                                }
                                isLoading={isLoading}
                                key={idx}
                                withDragHandle
                                withThumbnail={false}
                              />
                            </div>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </DragDropContext>
      </EntityList>
      <div
        style={{
          display: "flex",
          border: "1px dashed rgb(180, 195, 202)",
          borderRadius: 6,
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <Button
          buttonType="muted"
          icon="Plus"
          onClick={onAddValue}
          size="small"
          style={{ margin: "0 5px" }}
          type="button"
        >
          Add
        </Button>
      </div>
    </FieldGroup>
  );
};

export default Field;
