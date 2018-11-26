import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { toastr } from 'react-redux-toastr';
import { Button } from 'components';

const imageMaxSize = 1000000000; // bytes
const acceptedFileTypes =
  'image/x-png, image/png, image/jpeg, image/jpg, image/gif, .mov, video/mp3, video/mp4, video/quicktime';
const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
  return item.trim();
});

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
    this.handleClearToDefault = this.handleClearToDefault.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.image !== prevState.image && nextProps.image !== undefined
      ? {
          image: nextProps.image
        }
      : null;
  }

  /**
   * Called when <input> changed
   * @param event
   */
  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  /**
   * Very files before upload
   *
   * @param files
   */
  verifyFile(files) {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;

      if (currentFileSize > imageMaxSize) {
        toastr.error(
          'Error',
          `This file is not allowed. ${currentFileSize} bytes is too large`
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        toastr.error(
          'Error',
          'This file is not allowed. Only images are allowed'
        );
        return false;
      }

      return true;
    }
  }

  /**
   * handle OnDrop of Dropzone component
   * @param files
   * @param rejectedFiles
   */
  handleOnDrop(files, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length > 0) {
      this.verifyFile(rejectedFiles);
    }

    if (files && files.length > 0) {
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        // imageBase64Data
        const url = URL.createObjectURL(files[0]);
        this.setState({
          image: url
        });

        // Call handleOnLoad props function (ex: to fire reducer functions in parent components that use this component)
        if (this.props.handleOnLoad) {
          this.props.handleOnLoad(url);
        }
      }
    }
  }

  /**
   * Reset to default
   * @param event
   */
  handleClearToDefault(event) {
    if (event) event.preventDefault();
    this.setState({
      image: null
    });

    // Call handleClearToDefault prop function if function provided
    if (this.props.handleClearToDefault) {
      this.props.handleClearToDefault();
    }
  }

  render() {
    let style = this.props.style;
    // if (this.state.image && this.state.image !== '') {
    //   style = {
    //     backgroundImage: `url(${this.state.image})`,
    //     backgroundSize: 'contain',
    //     backgroundRepeat: 'no-repeat',
    //     backgroundPosition: '50% 50%',
    //     ...style,
    //   };
    // }

    const resetBtnStyle = {
      position: 'absolute',
      right: '-1.0rem',
      top: '-0.5rem'
    };

    return (
      <Dropzone
        onDrop={this.handleOnDrop}
        accept={acceptedFileTypes}
        className={this.props.className}
        style={style}
      >
        {this.state.image ? (
          <img
            src={this.state.image}
            alt=""
            className="w-100 h-100"
            style={{
              objectFit: 'cover',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18
            }}
          />
        ) : this.props.renderContent ? (
          this.props.renderContent
        ) : (
          <Button
            tag="a"
            color="link"
            onClick={this.handleClearToDefault}
            style={resetBtnStyle}
          >
            <i className="fa fa-times ml-auto" />
          </Button>
        )}
      </Dropzone>
    );
  }
}

ImageUploader.propTypes = {
  handleOnLoad: PropTypes.func,
  handleClearToDefault: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  image: PropTypes.string,
  renderContent: PropTypes.any
};

export default ImageUploader;
