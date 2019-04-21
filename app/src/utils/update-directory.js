import DropDownHolder from './dropdownholder';
import Api from '../api';
import { store } from '../store';

const updateDirectory = async () => {
  const { dispatch } = store
  DropDownHolder.alert('info', 'Actualizando directorio','')
  try {
    dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: {
        updating: true
      }
    })
    let directory = await Api.getDirectory();
    dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: {
        updated: true,
        data: Object.values(directory)
      }
    })
    DropDownHolder.alert('success', 'Directorio actualizado', 'Directorio actualizado con exito')
    dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: {
        updating: false
      }
    })
  } catch (error) {
    DropDownHolder.alert('error', 'Error', 'Error al actualizar el directorio')
    dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: {
        updating: false,
        updated: false,
      }
    })
    console.log(error)
  }
}

export default updateDirectory 