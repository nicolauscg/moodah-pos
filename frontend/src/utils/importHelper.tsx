import axios from 'axios'

const getImportEndpoint = sessionToken => {
  return axios.create({
    baseURL: process.env.REACT_APP_ODOO_URL,
    timeout: 30000,
    headers: {
      'X-Openerp-Session-Id': sessionToken,
      'Content-Type': 'multipart/form-data',
    },
  })
}

const importHelper = (file, id, sessionToken) => {
  const endpoint = getImportEndpoint(sessionToken)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('import_id', id)

  return endpoint.post('/base_import/set_file_new', formData)
}

export default importHelper
