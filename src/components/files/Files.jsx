import React, { Component } from 'react';
import {
  Col,
  Container, Row, Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import './css/files.css';
import api from '../../helpers/api';
import FileUploader from 'react-files';
import { uploadFile,fileDelete, openFile } from '../../helpers/helper';
import Editor from '../editor/Editor';
import Modal from 'react-modal';

const doc = document;
export default class Files extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      directory: null,
      errors: {},
      content: null,
      togleEditor: false,
      rawName: null,
      toggleModal: false,
      checked:{}
    }
    this.onFilesChange = this.onFilesChange.bind(this);
    this.onFilesError = this.onFilesError.bind(this);
    this.editFile = this.editFile.bind(this);
    this.openFileEvent = this.openFileEvent.bind(this)
    this.getDirectoryAndContent = this.getDirectoryAndContent.bind(this);
    this.newFile = this.newFile.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.checkFile = this.checkFile.bind(this);
  }
  getDirectoryAndContent(content, directory, rawName) {
    this.setState({ content: content });
    this.setState({ directory: directory });
    this.setState({ rawName: rawName });
    this.setState({ togleEditor: true });
  }
  onFilesChange(files) {
    uploadFile(files);
  }
  onFilesError(error, file) {
    console.log('error code ' + error.code + ': ' + error.message)
  }
  openFileEvent(e, fileName, ext) {
    e.preventDefault();
    openFile({ rawName: fileName, extension: ext }, this.getDirectoryAndContent)
  }
  newFile() {

  }
  checkFile(e,file){
    
    if (e.target.checked) {
      this.setState({checked:file});
      return document.getElementById(file.uuid).classList = "file-item selected";
    }
    document.getElementById(file.uuid).classList = "file-item"
  }
  deleteFile(){
    fileDelete(this.state.checked)
  }
  componentDidMount() {
    (async () => {
      await api.get('/files').then(res => {
        if (res.data.success === false) {
          this.setState({ errors: { message: res.data.message } });
          doc.body.innerHTML = res.data.message
        } else {
          this.setState({ files: res.data.files })
          this.setState({ directory: res.data.directory })
        }
      })
    })();
  }
  editFile(e) {
    e.preventDefault();
  }
  toggleModal() {
    this.setState({ toggleModal: !this.state.toggleModal });
  }
  render() {
    return (
      <Container>
        {
          this.state.togleEditor == false ?
            <Container>
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css" integrity="sha256-2XFplPlrFClt0bIdPgpz8H7ojnk10H69xRqd9+uTShA=" crossorigin="anonymous" />
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/4.5.6/css/ionicons.min.css" integrity="sha512-0/rEDduZGrqo4riUlwqyuHDQzp2D1ZCgH/gFIfjMIL5az8so6ZiXyhf1Rg8i6xsjv+z/Ubc4tt1thLigEcu6Ug==" crossorigin="anonymous" referrerpolicy="no-referrer" />
              <div className="container flex-grow-1 light-style container-p-y">
                <div className="container-m-nx container-m-ny bg-lightest mb-3">
                  <ol className="breadcrumb text-big container-p-x py-3 m-0">
                    <li className="breadcrumb-item">
                      <a>Files</a>
                    </li>
                  </ol>

                  <hr className="m-0" />

                  <div className="file-manager-actions container-p-x py-2">
                    <div>
                      <FileUploader
                        className='files-dropzone'
                        onChange={this.onFilesChange}
                        onError={this.onFilesError}
                        accepts={['image/png', '.pdf', 'audio/*']}
                        multiple
                        maxFiles={3}
                        maxFileSize={10000000}
                        minFileSize={0}
                        clickable
                      >
                        <button type="button" className="btn btn-primary mr-2"><i className="ion ion-md-cloud-upload"></i>&nbsp;Upload</button>
                      </FileUploader>
                      <button onClick={this.deleteFile} type="button" style={{ marginLeft: "10px" }} className="btn btn-primary mr-2"><i className="fa fa-trash"></i>&nbsp;</button>

                      <button onClick={this.toggleModal} type="button" style={{ marginLeft: "10px" }} className="btn btn-primary mr-2"><i className="fa fa-plus"></i>&nbsp;new file</button>
                    </div>

                  </div>

                  <hr className="m-0" />
                </div>

                <Row>
                  {
                    (this.state.files || []).map(file => (
                      <Col onDoubleClick={e => this.openFileEvent(e, file.raw, file.extension)} xs={12} key={file.uuid} className='col col-md-2'>
                        <div className="file-manager-container file-manager-col-view">
                          <div id={file.uuid} className="file-item">
                            <div className="file-item-select-bg bg-primary"></div>
                            <label className="file-item-checkbox custom-control custom-checkbox">
                              <input type="checkbox" onClick={(e)=>this.checkFile(e,file)} className="custom-control-input" />
                              <a href='#' onClick={this.editFile} style={{ margin: '10px' }} className=' custom-control-input'><i class="fas fa-edit"></i></a>
                            </label>
                            <div className={file.icon}></div>
                            <a href="javascript:void(0)" className="file-item-name">
                              {file.raw}
                            </a>
                          </div>
                        </div>

                      </Col>
                    ))
                  }
                </Row>
              </div>
              <Modal isOpen={this.state.toggleModal} toggle={this.toggleModal} className="mModal">
                <Row className="contApproval">
                  <Col xs="12">

                  </Col>
                </Row>
              </Modal>
            </Container>
            :
            <Editor rawName={this.state.rawName} content={this.state.content} />
        }
      </Container>
    )
  };
}