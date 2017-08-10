import React, { Component, PropTypes } from 'react';
import { FlatButton, TextField } from 'material-ui';

let unique = 1;

const FileInput = ({ label, onChange, value }) => {
  unique += 1;
  const id = `${Math.random()}_source_file_input_${unique}`;

  return (
    <div>
      <TextField
        floatingLabelText={label}
        onChange={e => onChange(e)}
        style={{ marginRight: '10px' }}
        value={value}
      />
      <FlatButton
        label="Browse..."
        onClick={() => {
          document.getElementById(id).click();
        }}
      />
      <input
        id={id}
        onChange={e => onChange(e)}
        style={{ display: 'none' }}
        type="file"
      />
    </div>
  );
};

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default FileInput;
