package gov.nist.hit.ss.config;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nist.hit.core.service.ResourcebundleLoader;

@Service
public class SSBootstrap {


	@Autowired
	ResourcebundleLoader resourcebundleLoader;
	
	@PostConstruct
	public void init() throws  Exception{
		resourcebundleLoader.load();
	}
	
}
