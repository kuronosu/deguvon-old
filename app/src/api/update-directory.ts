import DropDownHolder from '../utils/dropdownholder'
import { getDirectory } from '.'
import { store } from '../store'
import { resetLastRecent } from '../store/actions'

const updateDirectory = async () => {
  const { dispatch } = store
  DropDownHolder.alert('info', 'Actualizando directorio', '')
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
        updating: false,
        data: Object.values(directory)
      }
    })
    DropDownHolder.alert('success', 'Directorio actualizado', 'Directorio actualizado con exito')
  } catch (error) {
    dispatch({
      type: 'SET_DIRECTORY_DATA',
      payload: {
        updating: false,
        updated: false,
      }
    })
    dispatch(resetLastRecent())
    DropDownHolder.alert('error', 'Error', 'Error al actualizar el directorio')
    console.log(error)
  }
}

export default updateDirectory