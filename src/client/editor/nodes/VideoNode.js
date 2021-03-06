import EditorNodeMixin from "./EditorNodeMixin";
import Video from "../objects/Video";

export default class VideoNode extends EditorNodeMixin(Video) {
  static legacyComponentName = "video";

  static nodeName = "Video";

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const {
      src,
      controls,
      autoPlay,
      loop,
      audioType,
      volume,
      distanceModel,
      rolloffFactor,
      refDistance,
      maxDistance,
      coneInnerAngle,
      coneOuterAngle,
      coneOuterGain,
      projection
    } = json.components.find(c => c.name === "video").props;

    await node.load(src);
    node.controls = controls;
    node.autoPlay = autoPlay;
    node.loop = loop;
    node.audioType = audioType;
    node.volume = volume;
    node.distanceModel = distanceModel;
    node.rolloffFactor = rolloffFactor;
    node.refDistance = refDistance;
    node.maxDistance = maxDistance;
    node.coneInnerAngle = coneInnerAngle;
    node.coneOuterAngle = coneOuterAngle;
    node.coneOuterGain = coneOuterGain;
    node.projection = projection;

    return node;
  }

  constructor(editor) {
    super(editor, editor.audioListener);

    this._canonicalUrl = null;
    this._autoPlay = true;
    this.volume = 0.5;
  }

  get src() {
    return this._canonicalUrl;
  }

  set src(value) {
    this.load(value).catch(console.error);
  }

  get autoPlay() {
    return this._autoPlay;
  }

  set autoPlay(value) {
    this._autoPlay = value;
  }

  async load(src) {
    this._canonicalUrl = src;
    const { accessibleUrl } = await this.editor.project.resolveMedia(src);
    await super.load(accessibleUrl);
    this.videoEl.currentTime = this.videoEl.duration / 2;
    return this;
  }

  onChange() {
    this.onResize();
  }

  clone(recursive) {
    return new this.constructor(this.editor, this.audioListener).copy(this, recursive);
  }

  copy(source, recursive) {
    super.copy(source, recursive);

    this._canonicalUrl = source._canonicalUrl;

    return this;
  }

  serialize() {
    return super.serialize({
      video: {
        src: this._canonicalUrl,
        controls: this.controls,
        autoPlay: this.autoPlay,
        loop: this.loop,
        audioType: this.audioType,
        volume: this.volume,
        distanceModel: this.distanceModel,
        rolloffFactor: this.rolloffFactor,
        refDistance: this.refDistance,
        maxDistance: this.maxDistance,
        coneInnerAngle: this.coneInnerAngle,
        coneOuterAngle: this.coneOuterAngle,
        coneOuterGain: this.coneOuterGain,
        projection: this.projection
      }
    });
  }

  prepareForExport() {
    super.prepareForExport();
    this.addGLTFComponent("video", {
      src: this._canonicalUrl,
      controls: this.controls,
      autoPlay: this.autoPlay,
      loop: this.loop,
      audioType: this.audioType,
      volume: this.volume,
      distanceModel: this.distanceModel,
      rolloffFactor: this.rolloffFactor,
      refDistance: this.refDistance,
      maxDistance: this.maxDistance,
      coneInnerAngle: this.coneInnerAngle,
      coneOuterAngle: this.coneOuterAngle,
      coneOuterGain: this.coneOuterGain,
      projection: this.projection
    });
    this.addGLTFComponent("networked", {
      id: this.uuid
    });
    this.replaceObject();
  }
}
