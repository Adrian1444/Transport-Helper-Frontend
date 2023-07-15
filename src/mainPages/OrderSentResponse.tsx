import {useNavigate} from "react-router-dom";

interface OrderSentResponseProps {
    origin: string;
    destination: string;
    transportType: string;
    weight: unknown;
    numberOfItems: unknown;
    pickupDate: unknown;
    additionalInformation: unknown;
    perspective: string;
}

function OrderSentResponse(props: OrderSentResponseProps) {
    const { origin, destination, transportType, weight, numberOfItems, pickupDate, additionalInformation, perspective } = props;
    const navigate = useNavigate();

    function goBackToTheHomePage(){
        navigate("/home/"+perspective, {});
    }


    return(
        <div style={{margin: 30}}>
            {perspective==="client" ?
                <h5 style={{color: 'green'}}>The order has been placed successfully! Once a driver accepts the order you will see at the home page.</h5>
                :
                <h5 style={{color: 'green'}}>The order has been accepted successfully!</h5>
            }
            <br/>
            <h5 className="orderConfirmation">Order details:</h5>
            <ul className="list-group list-group-flush ">
                <li className="list-group-item orderConfirmation"><b>Origin:</b> {origin}</li>
                <li className="list-group-item orderConfirmation"><b>Destination:</b> {destination}</li>
                <li className="list-group-item orderConfirmation"><b>Transport type:</b> {transportType}</li>
                <li className="list-group-item orderConfirmation"><b>Weight:</b> {typeof weight === 'string' ? weight : 'not specified'}</li>
                <li className="list-group-item orderConfirmation"><b>Number of items:</b> {typeof numberOfItems === 'string' ? numberOfItems : 'not specified'}</li>
                <li className="list-group-item orderConfirmation"><b>Pickup date:</b> {typeof pickupDate === 'string' ? pickupDate : 'not specified'}</li>
                <li className="list-group-item orderConfirmation"><b>Additional information:</b> {typeof additionalInformation === 'string' ? additionalInformation : 'not specified'}</li>
            </ul>
            <br/>
            <button type="button" className="btn btn-success" onClick={goBackToTheHomePage}>Go to the home page</button>
        </div>
    );
}
export default OrderSentResponse;