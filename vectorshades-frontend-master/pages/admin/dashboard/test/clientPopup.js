import SelectClientPopup from "../../../../src/Components/Popups/General/SelectClientPopup"
import SelectClientInput from "../../../../src/Components/SelectClientInput"

export default () => {
    return <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SelectClientInput createJob={true} returnUser={() => { }} returnRaw={true} deleteUser={() => { }} />
    </div>
}