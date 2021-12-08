import React, {useState} from 'react'
import './App.sass'
import ReactMapGL, {MapEvent, Marker, Popup} from 'react-map-gl'
import Room from '@material-ui/icons/Room'
import TimelineIcon from '@material-ui/icons/Timeline'

const REACT_APP_MAPBOX = 'pk.eyJ1IjoibmV4b245MSIsImEiOiJja3d1azR1MGsxcjlwMnVsYzloOGQ2NGFzIn0.lwVmhUC9nfWNCyM_g784Pw'

type ViewportType = {
    width: number
    height: number
    latitude: number
    longitude: number
    zoom: number
}

type dataType = {
    id: number
    name: string
    date: string
    type: string
    coordinates: Array<number>
}

//Simple Data
const data: Array<dataType> = [
    {
        id: 123,
        name: 'Innovation center',
        date: '01.01.2010',
        type: 'point',
        coordinates: [37.6302262, 55.781544]
    },
    {
        id: 234,
        name: 'Line mark',
        date: '01.01.2010',
        type: 'line',
        coordinates: [37.689700434168, 55.69892083390516]
    }
]

function App() {
    // Init viewport
    const [viewport, setViewport] = useState<ViewportType>({
        width: 800,
        height: 400,
        latitude: 55.7287,
        longitude: 37.5965,
        zoom: 9
    })

    // Data
    const [geoData, setGeoData] = useState<Array<dataType>>(data)

    // Control button
    const [buttonToggle, setButtonToggle] = useState<string>('')
    const [radioButton, setRadioButton] = useState<string>('all')

    // Popup
    const [popupId, setPopupId] = useState(0)

    const onMapClick = (e: MapEvent) => {
        if (buttonToggle === 'point') {
            setGeoData([
                ...geoData,
                {
                    id: Math.floor(Math.random() * 10000),
                    name: 'Point mark',
                    date: `${new Date()}`,
                    type: 'point',
                    coordinates: [e.lngLat[0], e.lngLat[1]]
                }
            ])
            setButtonToggle('')
        } else if (buttonToggle === 'line') {
            setGeoData([
                ...geoData,
                {
                    id: Math.floor(Math.random() * 10000),
                    name: 'Line mark',
                    date: `${new Date()}`,
                    type: 'line',
                    coordinates: [e.lngLat[0], e.lngLat[1]]
                }
            ])
            setButtonToggle('')
        }
    }

    return (
        <div className="App">
            <div className="map__block">
                <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken={REACT_APP_MAPBOX}
                    onClick={onMapClick}
                    onViewportChange={(nextViewport: ViewportType) => setViewport(nextViewport)}
                    mapStyle="mapbox://styles/nexon91/ckwwaref790ks16p3pn7ytyw1"
                >
                    {geoData
                        .filter(p => radioButton === 'all' || p.type === radioButton)
                        .map(p => (
                                <div key={p.id}>
                                    <Marker
                                        longitude={p.coordinates[0]}
                                        latitude={p.coordinates[1]}
                                        offsetLeft={-20}
                                        offsetTop={-30}
                                        onClick={() => setPopupId(p.id)}
                                    >
                                        {p.type === 'point' &&
                                            <Room style={{fontSize: viewport.zoom * 3, color: 'slateblue'}}/>}
                                        {p.type === 'line' &&
                                            <TimelineIcon style={{fontSize: viewport.zoom * 3, color: 'red'}}/>}
                                    </Marker>)
                                    {popupId === p.id &&
                                        <Popup
                                            longitude={p.coordinates[0]}
                                            latitude={p.coordinates[1]}
                                            closeButton={true}
                                            closeOnClick={false}
                                            onClose={() => setPopupId(0)}
                                            anchor="bottom">
                                            <div className="card">
                                                <label>{p.name}</label>
                                                <label>{p.date}</label>
                                            </div>
                                        </Popup>
                                    }
                                </div>
                            )
                        )
                    }
                </ReactMapGL>
                <div className="control">
                    <div className="map__radiobutton">
                        <div>
                            <label htmlFor="all">All</label>
                            <input type="radio"
                                   id="all"
                                   name="type"
                                   value="all"
                                   checked={radioButton === 'all'}
                                   onChange={() => setRadioButton('all')}/>
                        </div>
                        <div>
                            <label htmlFor="point">Point</label>
                            <input type="radio"
                                   id="point"
                                   name="type"
                                   value="point"
                                   checked={radioButton === 'point'}
                                   onChange={() => setRadioButton('point')}/>
                        </div>
                        <div>
                            <label htmlFor="line">Line</label>
                            <input type="radio"
                                   id="line"
                                   name="type"
                                   value="line"
                                   checked={radioButton === 'line'}
                                   onChange={() => setRadioButton('line')}/>
                        </div>
                    </div>
                    <div className="map__button">
                        <button className="button__add_point"
                                onClick={() => setButtonToggle('point')}>
                            Add point
                        </button>
                        <button className="button__add_line"
                                onClick={() => setButtonToggle('line')}>
                            Add line
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
