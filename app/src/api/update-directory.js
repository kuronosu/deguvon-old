import DropDownHolder from '../utils/dropdownholder'
import { getDirectory } from '.'
import { store } from '../store'

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
    let directory = await getDirectory()
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
    dispatch({type: 'RESET_LAST'})
    console.log(error)
  }
}

export default updateDirectory 