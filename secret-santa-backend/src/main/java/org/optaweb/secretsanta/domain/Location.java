package org.optaweb.secretsanta.domain;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;

@Embeddable
public class Location {
    private String address;
    
    @NotNull
    private Double lat;
    @NotNull
    private Double lng;
    
    public Location() {  
    }
    
    public Location(String address, Double lat, Double lng) {
        this.address = address;
        this.lat = lat;
        this.lng = lng;
    }

    public String getAddress() {
        return address;
    }
    
    public Double getLat() {
        return lat;
    }
    
    public Double getLng() {
        return lng;
    }

    @Override
    public String toString() {
        return address + "(" + lat.toString() + "," + lng.toString() + ")";
    }
    
    public static double calculateDistanceBetween(Location a, Location b) {
        // Source https://www.movable-type.co.uk/scripts/latlong.html
        Double earthRadius = 6371e3; // metres
        Double angle1 = Math.toRadians(a.lat);
        Double angle2 = Math.toRadians(b.lat);
        Double changeInAngle = Math.toRadians(b.lat - a.lat);
        Double changeInLongitude = Math.toRadians(b.lng-a.lng);
        
        Double halfChordLengthSquared = Math.sin(changeInAngle/2) * Math.sin(changeInAngle/2) +
                Math.cos(angle1) * Math.cos(angle2) *
                Math.sin(changeInLongitude/2) * Math.sin(changeInLongitude/2);
        Double arclength = 2 * Math.atan2(Math.sqrt(halfChordLengthSquared), Math.sqrt(1-halfChordLengthSquared));

        return earthRadius * arclength;
    }
}
