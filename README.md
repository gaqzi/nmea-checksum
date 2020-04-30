# nmea-checksum
Library to calculate checksum for NMEA-0183 sentences

## How to use as a BigQuery function to add NMEA timestamp tags

This will add the timestamp tag to each sentence of the message, 
sentences are either split by newlines or by spaces.

1. Upload [`index.js`](./index.js) to a GCP bucket
2. Create a temp function referencing the library
3. Use it like a built-in function:
    ```sql
    CREATE TEMP FUNCTION
      addNmeaTimestampTag(timestamp TIMESTAMP,
        nmea STRING)
      RETURNS STRING
      LANGUAGE js OPTIONS ( library=["gs://my-bucket/index.js"] ) AS """
        return addTimestampTag(timestamp, nmea);
        """;
    SELECT
      timestamp,
      nmea,
      addNmeaTimestampTag(timestamp,
        nmea) AS new_checksum
    FROM
      `ais_suppliers__production`
    WHERE
        DATE(ingestion_time) = '2018-04-30'
        AND type=5
    LIMIT
        10
    ```
