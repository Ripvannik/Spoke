import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import BooleanInput from "../inputs/BooleanInput";
import NumericInput from "../inputs/NumericInput";
import Button from "../inputs/Button";
import ProgressDialog from "../dialogs/ProgressDialog";
import ErrorDialog from "../dialogs/ErrorDialog";
import { withDialog } from "../contexts/DialogContext";
import styles from "./FloorPlanNodeEditor.scss";

class FloorPlanNodeEditor extends Component {
  static propTypes = {
    hideDialog: PropTypes.func.isRequired,
    showDialog: PropTypes.func.isRequired,
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconClassName = "fa-shoe-prints";

  constructor(props) {
    super(props);
    const createPropSetter = propName => value => this.props.editor.setNodeProperty(this.props.node, propName, value);
    this.onChangeAutoCellSize = createPropSetter("autoCellSize");
    this.onChangeCellSize = createPropSetter("cellSize");
    this.onChangeCellHeight = createPropSetter("cellHeight");
    this.onChangeAgentHeight = createPropSetter("agentHeight");
    this.onChangeAgentRadius = createPropSetter("agentRadius");
    this.onChangeAgentMaxClimb = createPropSetter("agentMaxClimb");
    this.onChangeAgentMaxSlope = createPropSetter("agentMaxSlope");
    this.onChangeRegionMinSize = createPropSetter("regionMinSize");
  }

  onRegenerate = async () => {
    this.props.showDialog(ProgressDialog, {
      title: "Generating Floor Plan",
      message: "Generating floor plan..."
    });

    try {
      await this.props.node.generate();
      this.props.hideDialog();
    } catch (e) {
      console.error(e);
      this.props.showDialog(ErrorDialog, {
        title: "Error Generating Floor Plan",
        message: e.message || "There was an unknown error."
      });
    }
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor {...this.props} description="Sets the walkable surface area in your scene.">
        <InputGroup name="Auto Cell Size">
          <BooleanInput value={node.autoCellSize} onChange={this.onChangeAutoCellSize} />
        </InputGroup>
        {!node.autoCellSize && (
          <InputGroup name="Cell Size">
            <NumericInput value={node.cellSize} precision={0.0001} onChange={this.onChangeCellSize} />
          </InputGroup>
        )}
        <InputGroup name="Cell Height">
          <NumericInput value={node.cellHeight} onChange={this.onChangeCellHeight} />
        </InputGroup>
        <InputGroup name="Agent Height">
          <NumericInput value={node.agentHeight} onChange={this.onChangeAgentHeight} />
        </InputGroup>
        <InputGroup name="Agent Radius">
          <NumericInput value={node.agentRadius} onChange={this.onChangeAgentRadius} />
        </InputGroup>
        <InputGroup name="Maximum Step Height">
          <NumericInput value={node.agentMaxClimb} onChange={this.onChangeAgentMaxClimb} />
        </InputGroup>
        <InputGroup name="Maximum Slope">
          <NumericInput value={node.agentMaxSlope} onChange={this.onChangeAgentMaxSlope} />
        </InputGroup>
        <InputGroup name="Minimum Region Area">
          <NumericInput value={node.regionMinSize} onChange={this.onChangeRegionMinSize} />
        </InputGroup>
        <Button className={styles.regenerateButton} onClick={this.onRegenerate}>
          Regenerate
        </Button>
      </NodeEditor>
    );
  }
}

const FloorPlanNodeEditorContainer = withDialog(FloorPlanNodeEditor);
FloorPlanNodeEditorContainer.iconClassName = FloorPlanNodeEditor.iconClassName;
export default FloorPlanNodeEditorContainer;
