package gov.nist.healthcare.mu.ss.custom;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import hl7.v2.instance.Element;
import hl7.v2.instance.Query;
import hl7.v2.instance.Simple;
import scala.collection.Iterator;
import scala.collection.immutable.List;

public class SS_017_ACK {

    private String MSH21_1 = "PH_SS-Ack";
    private String MSH21_2 = "SS Sender";
    private String MSH21_3 = "2.16.840.1.114222.4.10.3";
    private String MSH21_4 = "ISO";

    protected static final Logger logger = LogManager.getLogger();
    
    public boolean assertion(hl7.v2.instance.Element e) {
        List<Element> MSH21_List = Query.query(e, "1[1].21[*]").get();
        Iterator<Element> it = MSH21_List.iterator();
        while (it.hasNext()) {
            Element MSH21 = it.next();
            List<Simple> MSH21_1_List = Query.queryAsSimple(MSH21, "1[1]").get();
            List<Simple> MSH21_2_List = Query.queryAsSimple(MSH21, "2[1]").get();
            List<Simple> MSH21_3_List = Query.queryAsSimple(MSH21, "3[1]").get();
            List<Simple> MSH21_4_List = Query.queryAsSimple(MSH21, "4[1]").get();

            if (MSH21_1_List.size() != 1) {
                logger.debug("MSH-21.1 list size = " + MSH21_1_List.size());
                return false;
            }
            if (MSH21_2_List.size() != 1) {
                logger.debug("MSH-21.2 list size = " + MSH21_2_List.size());
                return false;
            }
            if (MSH21_3_List.size() != 1) {
                logger.debug("MSH-21.3 list size = " + MSH21_3_List.size());
                return false;
            }
            if (MSH21_4_List.size() != 1) {
                logger.debug("MSH-21.4 list size = " + MSH21_4_List.size());
                return false;
            }

            boolean check = MSH21_1.equals(MSH21_1_List.apply(0).value().raw())
                    && MSH21_2.equals(MSH21_2_List.apply(0).value().raw())
                    && MSH21_3.equals(MSH21_3_List.apply(0).value().raw())
                    && MSH21_4.equals(MSH21_4_List.apply(0).value().raw());

            if (check) {
                return true;
            }
        }
        return false;
    }

}
