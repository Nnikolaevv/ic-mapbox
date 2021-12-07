import React, {useRef, useEffect, useState, FC} from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoibmV4b245MSIsImEiOiJja3d1azR1MGsxcjlwMnVsYzloOGQ2NGFzIn0.lwVmhUC9nfWNCyM_g784Pw'

type PropsTypes = {}

type dataType = {
    name: string
    date: string
    type: string
    coordinates: Array<number>
}

//Simple Data
const data: Array<dataType> = [
    {
        name: 'Innovation center',
        date: '01.01.2010',
        type: 'point',
        coordinates: [37.6302262, 55.781544]
    }
]

const MapBlockComponent: FC<PropsTypes> = (props) => {
    // mapboxgl
    const mapContainer = useRef<HTMLDivElement>(null)
    const [lng, setLng] = useState(37.5965)
    const [lat, setLat] = useState(55.7287)
    const [zoom, setZoom] = useState(9)

    // Data
    const [geoData, setGeoData] = useState<Array<dataType>>(data)

    // Control button
    const [buttonToggle, setButtonToggle] = useState<string>('')
    const [radioButton, setRadioButton] = useState<string>('all')

    // Initialize map when component mounts
    useEffect(() => {
        if (!mapContainer.current) return // initialize map only once

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        })

    // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right')

        map.on('move', () => {
            setLng(+(map.getCenter().lng.toFixed(4)))
            setLat(+(map.getCenter().lat.toFixed(4)))
            setZoom(+(map.getZoom().toFixed(4)))
        })

    // Filter marker at map
        geoData.filter(pos => radioButton === 'all' || pos.type === radioButton)
            .forEach(pos => {
                new mapboxgl.Marker()
                    .setLngLat(pos.coordinates as [number, number])
                    .setPopup(new mapboxgl.Popup({offset: 30}).setHTML(`<h4>${pos.name}</h4> <h5>${pos.date}</h5>`))
                    .addTo(map)
            })

    // Add marker at map on click
        map.on('click', (e) => {
            if (buttonToggle === 'point') {
                setGeoData(g => [
                        ...g,
                    {
                        name: 'Point mark',
                        date: `${new Date()}`,
                        type: 'point',
                        coordinates: [e.lngLat.lng, e.lngLat.lat]
                    }
                ])
                setButtonToggle('')
            } else if (buttonToggle === 'line') {
                setButtonToggle('')
            }
        })

    // Clean up on unmount
        return () => map.remove()
    }, [buttonToggle, radioButton])

    return (
        <>
            <div className="map__block">
                <div className="map__sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map__container"/>
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
        </>
    )
}

export default MapBlockComponent